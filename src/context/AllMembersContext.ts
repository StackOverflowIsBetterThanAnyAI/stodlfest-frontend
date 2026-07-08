import { createContext } from 'react'
import type { MemberProps } from '../types/types'

export const AllMembersContext = createContext<
    | [
          MemberProps[] | undefined,
          React.Dispatch<React.SetStateAction<MemberProps[] | []>>,
      ]
    | undefined
>(undefined)
