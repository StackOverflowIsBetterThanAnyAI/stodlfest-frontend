import { createContext } from 'react'
import type { TaskProps } from '../types/types'

export const UpcomingTasksContext = createContext<
    | [
          TaskProps[] | undefined,
          React.Dispatch<React.SetStateAction<TaskProps[] | []>>,
      ]
    | undefined
>(undefined)
