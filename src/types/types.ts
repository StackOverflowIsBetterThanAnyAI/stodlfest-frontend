import type { NavigateFunction } from 'react-router-dom'

export type ChatHistoryType = {
    role: 'bot' | 'user'
    message: string
}

export type ChatMessageListProps = {
    chatHistory: ChatHistoryType[]
    chatRef: React.RefObject<HTMLUListElement | null>
    isLoading: boolean
}

export type ChatMessageBotProps = {
    index: number
    message: string
    status: 'isLoading' | null
}

export type ChatMessageUserProps = {
    message: string
}

export type FormRadioButtonProps = {
    id: string
    label: string
    name: string
    value: string
    currentValue: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export type FormSwitchProps = {
    isSigningUp: boolean
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export type HeaderProps = {
    label: string
}

export type PriorityType = 'low' | 'middle' | 'high'

export type AgeType = 'underage' | 'ofLegalAge'

export type RequiresLegalAgeType =
    | 'doesRequireLegalAge'
    | 'doesNotRequireLegalAge'

export type JobProps = {
    job: string
    workers: number
    requires_legal_age: RequiresLegalAgeType
    id: number
}

export type MemberProps = {
    surname: string
    name: string
    age: AgeType
    id: number
    job?: string | null
}

export type TaskProps = {
    created_at: string
    description: string | null
    id: number
    priority: PriorityType
    task: string
    finished?: boolean
}

export type ToastProps = {
    label: string
}

export type ToastContextType = {
    showToast: (props: ToastProps) => void
    hideToast: () => void
}

export type TokenProps = {
    access: string
    refresh: string
}

export type handleAddNewJobProps = {
    accessToken: string
    e: React.FormEvent<HTMLFormElement>
    job: string
    navigate: NavigateFunction
    requiresLegalAge: RequiresLegalAgeType
    setAllJobs: React.Dispatch<React.SetStateAction<JobProps[]>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    setJob: (value: React.SetStateAction<string>) => void
    setWorkers: (value: React.SetStateAction<number>) => void
    showToast: (props: ToastProps) => void
    workers: number
}

export type handleAddNewMemberProps = {
    accessToken: string
    e: React.FormEvent<HTMLFormElement>
    age: AgeType
    name: string
    navigate: NavigateFunction
    setAge: React.Dispatch<React.SetStateAction<AgeType>>
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setIsSubmitDisabled: React.Dispatch<React.SetStateAction<boolean>>
    setName: React.Dispatch<React.SetStateAction<string>>
    setSurname: React.Dispatch<React.SetStateAction<string>>
    showToast: (props: ToastProps) => void
    surname: string
}

export type TargetActionType = 'assign' | 'unassign'

export type handleAssignMemberToJobProps = {
    accessToken: string
    allMembers: MemberProps[] | undefined
    job: JobProps
    member: MemberProps
    navigate: NavigateFunction
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    showToast: (props: ToastProps) => void
    targetAction: TargetActionType
}

export type handleBotResponseProps = {
    accessToken: string
    chatHistory: ChatHistoryType[]
    navigate: NavigateFunction
    setChatHistory: (value: React.SetStateAction<ChatHistoryType[]>) => void
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    showToast: (props: ToastProps) => void
}

export type handleFetchAllJobsProps = {
    accessToken: string
    navigate: NavigateFunction
    setAllJobs: React.Dispatch<React.SetStateAction<JobProps[]>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    showToast: (props: ToastProps) => void
}

export type handleFetchAllMembersProps = {
    accessToken: string
    navigate: NavigateFunction
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    showToast: (props: ToastProps) => void
}

export type handleFetchUpcomingTasksProps = {
    accessToken: string
    navigate: NavigateFunction
    setCompletedTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setUpcomingTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
}

export type handleAddNewTaskProps = {
    accessToken: string
    e: React.FormEvent<HTMLFormElement>
    description: string
    navigate: NavigateFunction
    priority: PriorityType
    setDescription: React.Dispatch<React.SetStateAction<string>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    setPriority: React.Dispatch<React.SetStateAction<PriorityType>>
    setTask: React.Dispatch<React.SetStateAction<string>>
    setUpcomingTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
    task: string
}

export type handleCompleteTaskProps = {
    accessToken: string
    navigate: NavigateFunction
    setCompletedTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setUpcomingTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
    task: TaskProps
    completedTasks: TaskProps[]
    upcomingTasks: TaskProps[]
}

export type handleDeleteCompletedTaskProps = {
    accessToken: string
    navigate: NavigateFunction
    setCompletedTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    showToast: (props: ToastProps) => void
    task: TaskProps
    completedTasks: TaskProps[]
}

export type handleRestoreCompletedTaskProps = {
    accessToken: string
    completedTasks: TaskProps[]
    navigate: NavigateFunction
    setCompletedTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setUpcomingTasks: (value: React.SetStateAction<TaskProps[] | []>) => void
    showToast: (props: ToastProps) => void
    task: TaskProps
}

export type handleDeleteJobProps = {
    accessToken: string
    allJobs: JobProps[] | undefined
    allMembers: MemberProps[] | undefined
    job: JobProps
    navigate: NavigateFunction
    setAllJobs: React.Dispatch<React.SetStateAction<JobProps[] | []>>
    setAllMembers: React.Dispatch<React.SetStateAction<[] | MemberProps[]>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    showToast: (props: ToastProps) => void
}

export type handleDeleteMemberProps = {
    accessToken: string
    allMembers: MemberProps[] | undefined
    member: MemberProps
    navigate: NavigateFunction
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    showToast: (props: ToastProps) => void
}

export type handleApplyUpdateJobProps = {
    accessToken: string
    allJobs: JobProps[] | undefined
    allMembers: MemberProps[] | undefined
    job: JobProps
    navigate: NavigateFunction
    setAllJobs: React.Dispatch<React.SetStateAction<JobProps[] | []>>
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    showToast: (props: ToastProps) => void
    updatedJob: string
    updatedRequiresLegalAge: RequiresLegalAgeType
    updatedWorkers: number
}

export type handleApplyUpdateTaskProps = {
    accessToken: string
    navigate: NavigateFunction
    setIsEdit: (value: React.SetStateAction<boolean>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setUpcomingTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
    task: TaskProps
    upcomingTasks: TaskProps[] | undefined
    updatedDescription: string
    updatedPriority: PriorityType
    updatedTask: string
}

export type handleLoginProps = {
    password: string
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: (value: React.SetStateAction<boolean | undefined>) => void
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    showToast: (props: ToastProps) => void
    userName: string
}

export type handleSignUpProps = {
    password: string
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsLoggedIn: (value: React.SetStateAction<boolean | undefined>) => void
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    showToast: (props: ToastProps) => void
    userName: string
}

export type ListAssignJobItemProps = {
    index: number
    job: JobProps
}

export type ListAssignJobItemDnDProps = {
    activeTargetZone: TargetActionType | null
    allMembers: MemberProps[] | undefined
    currentWorkersCount: number
    isToBeAssigned?: boolean
    job: JobProps
    setActiveTargetZone: React.Dispatch<
        React.SetStateAction<TargetActionType | null>
    >
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    showToast: (props: ToastProps) => void
}

export type ListJobsProps = {
    allJobs: JobProps[]
    ariaLabel: string
}

export type ListJobsItemProps = {
    index: number
    job: JobProps
}

export type ListMembersProps = {
    allMembers: MemberProps[]
    ariaLabel: string
}

export type ListMembersItemProps = {
    index: number
    member: MemberProps
}

export type ListPriorityType = {
    priority: PriorityType
}

export type ListButtonProps = {
    handleClick: () => void
    index?: number
    isLoading: boolean
    label: string
    type: 'refresh' | 'regular' | 'form'
    isDisabled?: boolean
    isSubmit?: boolean
}

type BaseListTaskProps = {
    tasks: TaskProps[]
    ariaLabel: string
}

type CompleteProps =
    | {
          allowComplete: true
          setCompletedTasks: React.Dispatch<
              React.SetStateAction<TaskProps[] | []>
          >
          setUpcomingTasks: React.Dispatch<
              React.SetStateAction<TaskProps[] | []>
          >
          completedTasks: TaskProps[]
          upcomingTasks: TaskProps[]
      }
    | {
          allowComplete?: false
      }

type DeleteProps =
    | {
          allowDelete: true
          setCompletedTasks: React.Dispatch<
              React.SetStateAction<TaskProps[] | []>
          >
          completedTasks: TaskProps[]
      }
    | {
          allowDelete?: false
      }

type EditProps =
    | {
          allowEdit: true
      }
    | {
          allowEdit?: false
      }

type RestoreType =
    | {
          allowRestore: true
          setCompletedTasks: React.Dispatch<
              React.SetStateAction<TaskProps[] | []>
          >
          completedTasks: TaskProps[]
      }
    | {
          allowRestore?: false
      }

export type ListTaskProps = BaseListTaskProps &
    CompleteProps &
    EditProps &
    DeleteProps &
    RestoreType

export type ListTaskItemProps = {
    props: ListTaskProps
    task: TaskProps
    index: number
}

export type useScreenWidthType = 'MOBILE' | 'TABLET' | 'DESKTOP'
