import { unique, type TaskType } from '../support/helpers'

const upcomingTask = (name: string) =>
    cy.get(`ul[aria-label="Anstehende Aufgaben"] > li[aria-label="${name}"]`)
const completedTask = (name: string) =>
    cy.get(`ul[aria-label="Erledigte Aufgaben"] > li[aria-label="${name}"]`)
const submitButton = () => cy.get('form button[type="submit"]').last()

const createTask = (body: Partial<TaskType>) =>
    cy.api<TaskType>('POST', '/tasks/', { priority: 'middle', ...body })

describe('Preparation', () => {
    it('creates a task with description and priority', () => {
        const name = unique('Task')
        cy.visitLoggedIn('/vorbereitung')

        submitButton().should('be.disabled')
        cy.get('#taskAdd').type(name)
        cy.get('#descriptionAdd').type('With description')
        cy.get('#highAdd').check()
        submitButton().should('be.enabled').click()

        upcomingTask(name)
            .should('contain', 'With description')
            .find('[aria-label="Priorität: Hoch"]')
        cy.get('#taskAdd').should('have.value', '')
        cy.get('#mediumAdd').should('be.checked')
    })

    it('reports a task that already exists', () => {
        const name = unique('Task')
        createTask({ task: name })
        cy.visitLoggedIn('/vorbereitung')

        cy.get('#taskAdd').type(name)
        submitButton().click()

        cy.toast('Eine Aufgabe mit diesem Namen existiert bereits.')
    })

    it('edits a task', () => {
        const name = unique('Task')
        const updatedName = unique('Updated')
        createTask({ task: name, priority: 'high' }).then(({ id }) => {
            cy.visitLoggedIn('/vorbereitung')

            upcomingTask(name).contains('button', 'Bearbeiten').click()
            cy.get(`#taskUpdate${id}`).clear().type(updatedName)
            cy.get(`#descriptionUpdate${id}`).type('New description')
            cy.get(`#lowUpdate${id}`).check()
            cy.contains('button', 'Anwenden').click()

            upcomingTask(updatedName)
                .should('contain', 'New description')
                .find('[aria-label="Priorität: Niedrig"]')
            cy.reload()
            upcomingTask(updatedName).should('contain', 'New description')
        })
    })

    it('completes, restores and deletes a task', () => {
        const name = unique('Task')
        createTask({ task: name })
        cy.visitLoggedIn('/vorbereitung')

        upcomingTask(name).contains('button', 'Erledigt').click()
        upcomingTask(name).should('not.exist')
        completedTask(name).contains('button', 'Wiederherstellen').click()
        completedTask(name).should('not.exist')
        upcomingTask(name).contains('button', 'Erledigt').click()
        completedTask(name).contains('button', 'Löschen').click()

        completedTask(name).should('not.exist')
        cy.reload()
        cy.contains('h2', 'Erledigte Aufgaben')
        upcomingTask(name).should('not.exist')
        completedTask(name).should('not.exist')
    })
})
