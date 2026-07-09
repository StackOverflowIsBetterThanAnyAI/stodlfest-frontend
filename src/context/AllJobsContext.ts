import { createContext } from 'react'
import type { JobProps } from '../types/types'

export const AllJobsContext = createContext<
    | [
          JobProps[] | undefined,
          React.Dispatch<React.SetStateAction<JobProps[] | []>>,
      ]
    | undefined
>(undefined)
