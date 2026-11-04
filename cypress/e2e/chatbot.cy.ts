import { API_URL } from '../support/helpers'

// the answers come from Gemini, so the chat endpoint is replaced in the tests
describe('Chatbot', () => {
    it('answers questions on the start page', () => {
        cy.intercept('POST', `${API_URL}/chat/`, {
            output_text: 'The Stodlfest starts at **6:30 pm**.',
        }).as('chat')
        cy.visitLoggedIn('/')

        cy.get('#chatbotInput').type('When does the festival start?{enter}')

        cy.wait('@chat')
            .its('request.body')
            .should('deep.include', {
                role: 'user',
                message: 'When does the festival start?',
            })
        cy.get('[aria-label="Chatverlauf mit Dieter.ai"]')
            .should('contain', 'Hallo, wie kann ich dir beim Stodlfest helfen?')
            .and('contain', 'When does the festival start?')
            .contains('strong', '6:30 pm')
        cy.get('#chatbotInput').should('have.value', '')
    })

    it('opens the chat widget on the other pages and reports errors', () => {
        cy.intercept('POST', `${API_URL}/chat/`, { statusCode: 500, body: {} })
        cy.visitLoggedIn('/aufgaben')

        cy.get('#chatbotWidgetInput').should('not.exist')
        cy.get('button[aria-label="Dieter.ai-Chatbot öffnen"]').click()
        cy.get('#chatbotWidgetInput').type('Hello{enter}')

        cy.toast('Fehler beim Abrufen der Antwort. Bitte versuche es erneut.')
        cy.get('button[aria-label="Dieter.ai-Chatbot schließen"]').click()
        cy.get('#chatbotWidgetInput').should('not.exist')
    })
})
