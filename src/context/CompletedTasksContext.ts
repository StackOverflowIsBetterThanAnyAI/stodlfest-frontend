import { createContext } from 'react'
import type { TaskProps } from '../types/types'

export const CompletedTasksContext = createContext<
    | [
          TaskProps[] | undefined,
          React.Dispatch<React.SetStateAction<TaskProps[] | []>>,
      ]
    | undefined
>(undefined)
