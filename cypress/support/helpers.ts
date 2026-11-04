// the address of the test backend, see cypress.config.ts
export const API_URL = Cypress.expose('API_URL') as string
export const PASSWORD = 'e2e-Password-1'

// names have to be unique in the backend, so every test creates its own data
export const unique = (prefix: string) =>
    `${prefix} ${Date.now().toString(36)}${Cypress._.random(100, 999)}`

// usernames may only contain latin letters and digits (5 to 20 characters)
export const uniqueUsername = () =>
    `e2e${Date.now().toString(36)}${Cypress._.random(1000, 9999)}`

export type JobType = {
    id: number
    job: string
    workers: number
    requires_legal_age: 'doesRequireLegalAge' | 'doesNotRequireLegalAge'
}

export type MemberType = {
    id: number
    name: string
    surname: string
    age: 'underage' | 'ofLegalAge'
    job: string | null
}

export type TaskType = {
    id: number
    task: string
    description: string | null
    priority: 'low' | 'middle' | 'high'
    finished: boolean
}
