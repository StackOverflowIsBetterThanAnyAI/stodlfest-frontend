import { ROUTES } from '../constants/constants'

export const getValidRoute = (pathname: string[]) => {
    return ROUTES.includes(pathname.join('/'))
        ? pathname.map((item) => {
              return item
                  .split('-')
                  .map((i) => {
                      return (
                          i.substring(0, 1).toUpperCase() +
                          i.substring(1).toLowerCase()
                      )
                  })
                  .join(' ')
          })
        : null
}
