import { unique, type MemberType } from '../support/helpers'

const memberList = 'ul[aria-label="Anwesende Mitglieder"]'
const member = (name: string, surname: string) =>
    cy.get(`${memberList} > li[aria-label="${name} ${surname}"]`)
const submitButton = () => cy.get('form button[type="submit"]')

const createMember = (body: Partial<MemberType>) =>
    cy.api<MemberType>('POST', '/members/', { age: 'ofLegalAge', ...body })

describe('Members', () => {
    it('creates a member', () => {
        const name = unique('Firstname')
        const surname = unique('Lastname')
        cy.visitLoggedIn('/mitglieder')

        submitButton().should('be.disabled')
        cy.get('#nameAdd').type(name)
        submitButton().should('be.disabled')
        cy.get('#surnameAdd').type(surname)
        cy.get('#underageAdd').check()
        submitButton().should('be.enabled').click()

        member(name, surname)
            .should('contain', `${surname} ${name}`)
            .and('contain', 'Minderjährig')
            .and('contain', 'keine Aufgabe')
        cy.get('#nameAdd').should('have.value', '')
        cy.get('#surnameAdd').should('have.value', '')
        cy.get('#ofLegalAgeAdd').should('be.checked')
        cy.get(`${memberList} > li`)
            .its('length')
            .then((count) => cy.contains('h2', `Anwesende Mitglieder: ${count}`))
    })

    it('keeps the draft after a reload and requires both names', () => {
        cy.visitLoggedIn('/mitglieder')

        cy.get('#surnameAdd').type('Draft')
        cy.get('#underageAdd').check()
        cy.reload()

        cy.get('#surnameAdd').should('have.value', 'Draft')
        cy.get('#underageAdd').should('be.checked')
        submitButton().should('be.disabled')
        cy.get('#nameAdd').type('Draft')
        submitButton().should('be.enabled')
    })

    it('reports a member that already exists', () => {
        const name = unique('Firstname')
        const surname = unique('Lastname')
        createMember({ name, surname })
        cy.visitLoggedIn('/mitglieder')

        cy.get('#nameAdd').type(name)
        cy.get('#surnameAdd').type(surname)
        submitButton().click()

        cy.toast('Ein Mitglied mit diesem Namen und Nachnamen existiert bereits.')
    })

    it('reloads new members and removes a member', () => {
        const name = unique('Firstname')
        const surname = unique('Lastname')
        cy.visitLoggedIn('/mitglieder')
        cy.contains('h2', 'Anwesende Mitglieder')
        createMember({ name, surname })

        cy.contains('button', 'Neuladen').click()
        member(name, surname).contains('button', 'Entfernen').click()

        member(name, surname).should('not.exist')
        cy.reload()
        cy.get(memberList).should('exist')
        member(name, surname).should('not.exist')
    })
})
