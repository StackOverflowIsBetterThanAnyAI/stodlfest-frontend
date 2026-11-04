/// <reference types="cypress" />
import { API_URL, PASSWORD, uniqueUsername } from './helpers'

type TokensType = { access: string; refresh: string }
type MethodType = 'GET' | 'POST' | 'PATCH' | 'DELETE'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            /** request to the test backend as the user of this spec, e.g. to create test data */
            api<T = unknown>(
                method: MethodType,
                path: string,
                body?: object
            ): Chainable<T>
            /** visits a page as the logged in user of this spec */
            visitLoggedIn(path?: string): Chainable<Cypress.AUTWindow>
            /** yields the toast with this text */
            toast(text: string | RegExp): Chainable<JQuery<HTMLElement>>
        }
    }
}

let tokens: TokensType | null = null
let blockedRequests: string[] = []

// The app under test might use another backend than the tests, e.g. a dev server that talks to
// the production backend. Such requests are blocked before they are sent and fail the test.
beforeEach(() => {
    blockedRequests = []
    const appOrigin = new URL(Cypress.config('baseUrl') || '').origin
    cy.intercept({ url: /\/api\// }, (req) => {
        if (
            new URL(req.url).origin === appOrigin ||
            req.url.startsWith(`${API_URL}/`)
        ) {
            return
        }
        blockedRequests.push(`${req.method} ${req.url}`)
        req.reply({ forceNetworkError: true })
    })
})

afterEach(() => {
    expect(
        blockedRequests,
        `requests to other backends than the test backend ${API_URL}`
    ).to.deep.equal([])
})

// every spec registers its own user, the backend returns its tokens right away
const getTokens = (): Cypress.Chainable<TokensType> => {
    if (tokens) {
        return cy.wrap(tokens, { log: false })
    }
    return cy
        .request<TokensType>('POST', `${API_URL}/auth/register/`, {
            username: uniqueUsername(),
            password: PASSWORD,
        })
        .its('body')
        .then((body) => {
            tokens = { access: body.access, refresh: body.refresh }
            return tokens
        })
}

Cypress.Commands.add(
    'api',
    (method: MethodType, path: string, body?: object) =>
        getTokens().then(({ access }) =>
            cy
                .request({
                    method,
                    url: `${API_URL}${path}`,
                    body,
                    headers: { Authorization: `Bearer ${access}` },
                })
                .its('body')
        )
)

Cypress.Commands.add('visitLoggedIn', (path = '/') =>
    getTokens().then(({ access, refresh }) =>
        cy.visit(path, {
            onBeforeLoad: (win) => {
                win.localStorage.setItem(
                    'stodlfest',
                    JSON.stringify({
                        isLoggedIn: true,
                        accessToken: access,
                        refreshToken: refresh,
                    })
                )
            },
        })
    )
)

Cypress.Commands.add('toast', (text: string | RegExp) =>
    cy.contains('[role="status"]', text)
)

export {}
