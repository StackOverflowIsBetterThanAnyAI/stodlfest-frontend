import { API_URL, PASSWORD, uniqueUsername } from '../support/helpers'

const submitButton = () => cy.get('form button[type="submit"]')

const fillLogin = (username: string, password: string) => {
    cy.get('#username').clear().type(username)
    cy.get('#password').clear().type(password)
}

const registerUser = (username: string) =>
    cy.request('POST', `${API_URL}/auth/register/`, {
        username,
        password: PASSWORD,
    })

describe('Authentication', () => {
    it('shows the login on every page without a session', () => {
        cy.visit('/mitglieder')

        cy.location('pathname').should('eq', '/')
        cy.title().should('eq', 'Stodlfest | Startseite')
        cy.contains('h1', 'Login')
        cy.contains('a', 'Mitglieder').should('not.exist')
    })

    it('signs up a user, logs out and logs in again', () => {
        const username = uniqueUsername()
        cy.visit('/')

        cy.get('button[aria-pressed]').click()
        cy.contains('h1', 'Signup')
        cy.get('#username').type(username)

        // the confirmation is only enabled for a valid password and has to match it
        cy.get('#password').type('short')
        cy.get('#confirmPassword').should('be.disabled')
        submitButton().should('be.disabled')
        cy.get('#password').clear().type(PASSWORD)
        cy.get('#confirmPassword').should('be.enabled').type(`${PASSWORD}x`)
        submitButton().should('be.disabled')
        cy.get('#confirmPassword').clear().type(PASSWORD)
        submitButton().should('be.enabled').click()

        cy.contains('h1', 'Countdown bis zum')
        cy.contains('button', 'Abmelden').click()
        cy.toast('Erfolgreich abgemeldet.')
        cy.contains('h1', 'Login')

        fillLogin(username, PASSWORD)
        submitButton().click()
        cy.contains('h1', 'Countdown bis zum')
    })

    it('reports a wrong password', () => {
        const username = uniqueUsername()
        registerUser(username)
        cy.visit('/')

        fillLogin(username, `${PASSWORD}x`)
        submitButton().click()

        cy.toast('Nutzer konnte nicht angemeldet werden')
        cy.contains('h1', 'Login')
    })

    it('reports a username that is already taken', () => {
        const username = uniqueUsername()
        registerUser(username)
        cy.visit('/')

        cy.get('button[aria-pressed]').click()
        fillLogin(username, PASSWORD)
        cy.get('#confirmPassword').type(PASSWORD)
        submitButton().click()

        cy.toast('Dieser Benutzername ist bereits vergeben.')
        cy.contains('h1', 'Signup')
    })

    it('logs out with an invalid session', () => {
        cy.visit('/mitglieder', {
            onBeforeLoad: (win) => {
                win.localStorage.setItem(
                    'stodlfest',
                    JSON.stringify({
                        isLoggedIn: true,
                        accessToken: 'invalid',
                        refreshToken: 'invalid',
                    })
                )
            },
        })

        cy.toast('Nutzersession ungültig. Bitte melde Dich erneut an.')
        cy.location('pathname').should('eq', '/')
        cy.contains('h1', 'Login')
    })
})
