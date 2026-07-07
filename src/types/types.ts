import type { ChangeEvent } from 'react'

export type FormRadioButtonProps = {
    id: string
    label: string
    value: string
    currentPriority: PriorityType
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export type HeaderProps = {
    label: string
}

export type PriorityType = 'low' | 'middle' | 'high'

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

export type handleApplyUpdateProps = {
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

export type ListPriorityType = {
    priority: PriorityType
}

type BaseListTaskProps = {
    tasks: TaskProps[]
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

type EditProps =
    | {
          allowEdit: true
      }
    | {
          allowEdit?: false
      }

export type ListTaskProps = BaseListTaskProps &
    DeleteProps &
    CompleteProps &
    EditProps

export type ListButtonProps = {
    handleClick: () => void
    index: number
    isLoading: boolean
    label: string
    isSubmit?: boolean
}

export type ListTaskItemProps = {
    props: ListTaskProps
    task: TaskProps
    index: number
}
