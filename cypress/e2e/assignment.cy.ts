import {
    API_URL,
    unique,
    type JobType,
    type MemberType,
} from '../support/helpers'

const jobItem = (name: string) =>
    cy.get(`ul[aria-label="Verfügbare Aufgaben"] > li[aria-label="${name}"]`)
// every job has a zone with the available and a zone with the assigned members
const availableZone = (jobName: string) => jobItem(jobName).find('.h-32').first()
const assignedZone = (jobName: string) => jobItem(jobName).find('.h-32').last()
const memberButton = (member: MemberType) => `${member.surname} ${member.name}`

// the members can also be moved with the keyboard instead of drag and drop
const pressEnter = (zone: Cypress.Chainable, member: MemberType) =>
    zone.contains('button', memberButton(member)).trigger('keydown', { key: 'Enter' })

// The page shows the members of the session storage first and loads them again (twice in
// the StrictMode of the dev server). A member moved before every response has arrived
// would be overwritten by an older response, so the tests wait until no request is pending.
let pendingMemberRequests = 0

const interceptMembers = () => {
    pendingMemberRequests = 0
    cy.intercept('GET', `${API_URL}/members/`, (req) => {
        pendingMemberRequests++
        req.on('after:response', () => {
            pendingMemberRequests--
        })
    }).as('members')
}

const waitForMembers = () => {
    cy.wait('@members')
    cy.wrap(null, { log: false }).should(() => {
        expect(pendingMemberRequests, 'pending requests').to.equal(0)
    })
}

const reloadAndWaitForMembers = () => {
    cy.reload()
    waitForMembers()
}

const dragAndDrop = (
    from: Cypress.Chainable,
    member: MemberType,
    to: () => Cypress.Chainable
) => {
    const dataTransfer = new DataTransfer()
    from.contains('li', memberButton(member)).trigger('dragstart', { dataTransfer })
    to().trigger('drop', { dataTransfer })
}

describe('Work assignment', () => {
    let job: JobType
    let adultJob: JobType
    let adult: MemberType
    let secondAdult: MemberType
    let minor: MemberType

    beforeEach(() => {
        cy.api<JobType>('POST', '/jobs/', {
            job: unique('Grill'),
            workers: 2,
            requires_legal_age: 'doesNotRequireLegalAge',
        }).then((created) => (job = created))
        cy.api<JobType>('POST', '/jobs/', {
            job: unique('Bar'),
            workers: 1,
            requires_legal_age: 'doesRequireLegalAge',
        }).then((created) => (adultJob = created))
        cy.api<MemberType>('POST', '/members/', {
            name: unique('Adult'),
            surname: 'One',
            age: 'ofLegalAge',
        }).then((created) => (adult = created))
        cy.api<MemberType>('POST', '/members/', {
            name: unique('Adult'),
            surname: 'Two',
            age: 'ofLegalAge',
        }).then((created) => (secondAdult = created))
        cy.api<MemberType>('POST', '/members/', {
            name: unique('Child'),
            surname: 'Three',
            age: 'underage',
        }).then((created) => (minor = created))
        interceptMembers()
        cy.visitLoggedIn('/arbeitseinteilung')
        waitForMembers()
    })

    it('assigns members with the keyboard until the job is full and unassigns them', () => {
        jobItem(job.job).should('contain', '0 von 2 erforderlichen Helfern')

        pressEnter(availableZone(job.job), adult)
        assignedZone(job.job).should('contain', memberButton(adult))
        pressEnter(availableZone(job.job), secondAdult)
        jobItem(job.job).should('contain', '2 von 2 erforderlichen Helfern')
        availableZone(job.job)
            .contains('button', memberButton(minor))
            .should('be.disabled')

        reloadAndWaitForMembers()
        assignedZone(job.job).should('contain', memberButton(secondAdult))
        pressEnter(assignedZone(job.job), adult)
        jobItem(job.job).should('contain', '1 von 2 erforderlichen Helfern')
        availableZone(job.job).should('contain', memberButton(adult))
    })

    it('does not offer underage members for jobs that require legal age', () => {
        availableZone(job.job).should('contain', memberButton(minor))
        availableZone(adultJob.job)
            .should('contain', memberButton(adult))
            .and('not.contain', memberButton(minor))
    })

    it('assigns members with drag and drop', () => {
        dragAndDrop(availableZone(job.job), minor, () => assignedZone(job.job))

        assignedZone(job.job).should('contain', memberButton(minor))
        jobItem(job.job).should('contain', '1 von 2 erforderlichen Helfern')
    })

    it('does not move members between different jobs', () => {
        dragAndDrop(availableZone(job.job), adult, () =>
            assignedZone(adultJob.job)
        )

        cy.toast('Mitglieder können nicht zwischen verschiedenen Aufgaben verschoben werden.')
        assignedZone(adultJob.job).should('not.contain', memberButton(adult))
    })
})
