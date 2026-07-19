export type FormRadioButtonProps = {
    id: string
    label: string
    name: string
    value: string
    currentValue: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
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

export type handleAddNewJobProps = {
    e: React.FormEvent<HTMLFormElement>
    job: string
    requiresLegalAge: RequiresLegalAgeType
    setAllJobs: React.Dispatch<React.SetStateAction<JobProps[]>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    setJob: (value: React.SetStateAction<string>) => void
    setWorkers: (value: React.SetStateAction<number>) => void
    showToast: (props: ToastProps) => void
    workers: number
}

export type handleAddNewMemberProps = {
    e: React.FormEvent<HTMLFormElement>
    age: AgeType
    name: string
    setAge: React.Dispatch<React.SetStateAction<AgeType>>
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setIsSubmitDisabled: React.Dispatch<React.SetStateAction<boolean>>
    setName: React.Dispatch<React.SetStateAction<string>>
    setSurname: React.Dispatch<React.SetStateAction<string>>
    showToast: (props: ToastProps) => void
    surname: string
}

export type TargetActionType = 'assign' | 'unassign'

export type handleAssignMemberToJobProps = {
    allMembers: MemberProps[] | undefined
    job: JobProps
    member: MemberProps
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    showToast: (props: ToastProps) => void
    targetAction: TargetActionType
}

export type handleFetchAllJobsProps = {
    setAllJobs: React.Dispatch<React.SetStateAction<JobProps[]>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    showToast: (props: ToastProps) => void
}

export type handleFetchAllMembersProps = {
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    showToast: (props: ToastProps) => void
}

export type handleFetchUpcomingTasksProps = {
    setCompletedTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setUpcomingTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
}

export type handleAddNewTaskProps = {
    e: React.FormEvent<HTMLFormElement>
    description: string
    priority: PriorityType
    setDescription: React.Dispatch<React.SetStateAction<string>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    setPriority: React.Dispatch<React.SetStateAction<PriorityType>>
    setTask: React.Dispatch<React.SetStateAction<string>>
    setUpcomingTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
    task: string
}

export type handleCompleteTaskProps = {
    setCompletedTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setUpcomingTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
    task: TaskProps
    completedTasks: TaskProps[]
    upcomingTasks: TaskProps[]
}

export type handleDeleteCompletedTaskProps = {
    setCompletedTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    showToast: (props: ToastProps) => void
    task: TaskProps
    completedTasks: TaskProps[]
}

export type handleRestoreCompletedTaskProps = {
    setCompletedTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setUpcomingTasks: (value: React.SetStateAction<TaskProps[] | []>) => void
    showToast: (props: ToastProps) => void
    task: TaskProps
    completedTasks: TaskProps[]
}

export type handleDeleteJobProps = {
    allJobs: JobProps[] | undefined
    allMembers: MemberProps[] | undefined
    job: JobProps
    setAllJobs: React.Dispatch<React.SetStateAction<JobProps[] | []>>
    setAllMembers: React.Dispatch<React.SetStateAction<[] | MemberProps[]>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    showToast: (props: ToastProps) => void
}

export type handleDeleteMemberProps = {
    allMembers: MemberProps[] | undefined
    member: MemberProps
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    showToast: (props: ToastProps) => void
}

export type handleApplyUpdateJobProps = {
    allJobs: JobProps[] | undefined
    allMembers: MemberProps[] | undefined
    job: JobProps
    setAllJobs: React.Dispatch<React.SetStateAction<JobProps[] | []>>
    setAllMembers: React.Dispatch<React.SetStateAction<MemberProps[] | []>>
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    showToast: (props: ToastProps) => void
    updatedJob: string
    updatedRequiresLegalAge: RequiresLegalAgeType
    updatedWorkers: number
}

export type handleApplyUpdateTaskProps = {
    setIsEdit: (value: React.SetStateAction<boolean>) => void
    setIsLoading: (value: React.SetStateAction<boolean>) => void
    setUpcomingTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
    task: TaskProps
    upcomingTasks: TaskProps[] | undefined
    updatedDescription: string
    updatedPriority: PriorityType
    updatedTask: string
}

export type ListAssignJobItemProps = {
    index: number
    job: JobProps
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
          showToast: (props: ToastProps) => void
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
          showToast: (props: ToastProps) => void
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
          showToast: (props: ToastProps) => void
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

export type ListButtonProps = {
    handleClick: () => void
    index?: number
    isLoading: boolean
    label: string
    type: 'refresh' | 'regular' | 'form'
    isDisabled?: boolean
    isSubmit?: boolean
}

export type ListTaskItemProps = {
    props: ListTaskProps
    task: TaskProps
    index: number
}

export type useScreenWidthType = 'MOBILE' | 'TABLET' | 'DESKTOP'
