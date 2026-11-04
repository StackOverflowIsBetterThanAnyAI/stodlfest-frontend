const PAGES = [
    { link: 'Arbeitseinteilung', path: '/arbeitseinteilung', heading: 'Arbeitseinteilung' },
    { link: 'Aufgaben', path: '/aufgaben', heading: 'Aufgaben' },
    { link: 'Mitglieder', path: '/mitglieder', heading: 'Mitglieder' },
    { link: 'Vorbereitung', path: '/vorbereitung', heading: 'Vorbereitungen' },
]

describe('Navigation', () => {
    it('leads to every page and sets the document title', () => {
        cy.visitLoggedIn('/')
        cy.title().should('eq', 'Stodlfest | Startseite')

        PAGES.forEach(({ link, path, heading }) => {
            cy.get('nav').contains('a', link).click()
            cy.location('pathname').should('eq', path)
            cy.contains('h1', heading)
            cy.title().should('eq', `Stodlfest | ${link}`)
        })

        cy.get('a[aria-label="Stodlfest Startseite"]').click()
        cy.contains('h1', 'Countdown bis zum')
    })

    it('shows the 404 page for unknown pages', () => {
        cy.visitLoggedIn('/does-not-exist')

        cy.contains('404')
        cy.title().should('eq', 'Stodlfest | 404 Not Found')
        cy.contains('button', 'Zurück zur Startseite').click()
        cy.location('pathname').should('eq', '/')
    })

    it('opens and closes the mobile menu', () => {
        cy.viewport(375, 700)
        cy.visitLoggedIn('/')

        cy.get('button[aria-controls="mobile-navigation"]')
            .should('have.attr', 'aria-expanded', 'false')
            .click()
            .should('have.attr', 'aria-expanded', 'true')
        cy.get('#mobile-navigation').contains('a', 'Mitglieder').click()
        cy.contains('h1', 'Mitglieder')

        cy.get('button[aria-controls="mobile-navigation"]').click()
        cy.get('#mobile-navigation').should('not.exist')
    })

    it('links the GitHub repository in a new tab', () => {
        cy.visit('/')

        cy.get('footer a')
            .should(
                'have.attr',
                'href',
                'https://github.com/StackOverflowIsBetterThanAnyAI/stodlfest-frontend'
            )
            .and('have.attr', 'target', '_blank')
            .and('have.attr', 'rel', 'noopener noreferrer')
    })
})
