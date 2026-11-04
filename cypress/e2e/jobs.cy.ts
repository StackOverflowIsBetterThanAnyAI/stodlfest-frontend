import { unique, type JobType } from '../support/helpers'

const job = (name: string) =>
    cy.get(`ul[aria-label="Verfügbare Aufgaben"] > li[aria-label="${name}"]`)
const submitButton = () => cy.get('form button[type="submit"]').last()

// React only notices a new value of a range input via the native setter
const setRange = (selector: string, value: number) =>
    cy.get(selector).then(($input) => {
        const input = $input[0] as HTMLInputElement
        Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value'
        )?.set?.call(input, String(value))
        input.dispatchEvent(new Event('input', { bubbles: true }))
    })

const createJob = (body: Partial<JobType>) =>
    cy.api<JobType>('POST', '/jobs/', {
        workers: 2,
        requires_legal_age: 'doesNotRequireLegalAge',
        ...body,
    })

describe('Jobs', () => {
    it('creates a job', () => {
        const name = unique('Job')
        cy.visitLoggedIn('/aufgaben')

        submitButton().should('be.disabled')
        cy.get('#jobAdd').type(name)
        setRange('#workersAdd', 4)
        cy.get('#legalAgeAdd').check()
        submitButton().should('be.enabled').click()

        job(name)
            .should('contain', '4 erforderliche Helfer')
            .and('contain', 'Volljährigkeit erforderlich')
        cy.get('#jobAdd').should('have.value', '')
    })

    it('reports a job that already exists', () => {
        const name = unique('Job')
        createJob({ job: name })
        cy.visitLoggedIn('/aufgaben')

        cy.get('#jobAdd').type(name.toUpperCase())
        submitButton().click()

        cy.toast('Eine Aufgabe mit diesem Namen existiert bereits.')
    })

    it('edits a job and discards changes with escape', () => {
        const name = unique('Job')
        const updatedName = unique('Updated')
        createJob({ job: name }).then(({ id }) => {
            cy.visitLoggedIn('/aufgaben')

            job(name).contains('button', 'Bearbeiten').click()
            cy.get(`#jobUpdate${id}`).clear().type('Discarded{esc}')
            job(name).should('contain', name).and('contain', '2 erforderliche Helfer')

            job(name).contains('button', 'Bearbeiten').click()
            cy.get(`#jobUpdate${id}`).clear().type(updatedName)
            setRange(`#workersUpdate${id}`, 6)
            cy.get(`#legalAgeUpdate${id}`).check()
            cy.contains('button', 'Anwenden').click()

            job(updatedName)
                .should('contain', '6 erforderliche Helfer')
                .and('contain', 'Volljährigkeit erforderlich')
            cy.reload()
            job(updatedName).should('contain', '6 erforderliche Helfer')
        })
    })

    it('deletes a job', () => {
        const name = unique('Job')
        createJob({ job: name })
        cy.visitLoggedIn('/aufgaben')

        job(name).contains('button', 'Löschen').click()

        job(name).should('not.exist')
        cy.reload()
        cy.get('ul[aria-label="Verfügbare Aufgaben"]').should('exist')
        job(name).should('not.exist')
    })
})
