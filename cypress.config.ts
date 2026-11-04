import { defineConfig } from 'cypress'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

// The tests create users and data, so they must never run against the production backend.
// The address of the backend is therefore only taken from .env.audit.local, which is written
// by scripts/audit/start-backend.sh. It always starts its own backend with a new SQLite database.
const TEST_BACKEND_FILE = '.env.audit.local'

const getTestBackend = (projectRoot: string) => {
    const path = join(projectRoot, TEST_BACKEND_FILE)
    const address = existsSync(path)
        ? readFileSync(path, 'utf8').match(/^VITE_SERVER_ADDRESS=(.+)$/m)?.[1]
        : undefined
    if (!address) {
        throw new Error(
            `${TEST_BACKEND_FILE} is missing. Start the test backend with "bash scripts/audit/start-backend.sh" first, the e2e tests never run against another backend.`
        )
    }
    return address.trim()
}

export default defineConfig({
    e2e: {
        baseUrl: 'http://127.0.0.1:5173',
        viewportWidth: 1280,
        viewportHeight: 800,
        video: false,
        retries: { runMode: 1, openMode: 0 },
        setupNodeEvents(_on, config) {
            config.expose = {
                ...config.expose,
                API_URL: `${getTestBackend(config.projectRoot)}/api`,
            }
            return config
        },
    },
})
