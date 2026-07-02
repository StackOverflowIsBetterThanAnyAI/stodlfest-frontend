import { getValidPathname } from './getValidPathname'
import { getValidRoute } from './getValidRoute'

export const setDocumentTitle = () => {
    const pathname = getValidPathname().length
        ? getValidPathname()
        : ['startseite']

    const validRoute = getValidRoute(pathname)

    return `Stodlfest | ${validRoute || '404 Not Found'}`
}
