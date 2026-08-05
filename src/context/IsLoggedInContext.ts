import { createContext } from 'react'

export const IsLoggedInContext = createContext<
    | [
          boolean | undefined,
          React.Dispatch<React.SetStateAction<boolean | undefined>>,
      ]
    | undefined
>(undefined)
