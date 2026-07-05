import type { ChangeEvent } from 'react'

export type FormRadioButtonProps = {
    id: string
    label: string
    value: string
    currentPriority: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export type HeaderProps = {
    label: string
}

export type TaskProps = {
    created_at: string
    description: string | null
    id: number
    priority: 'low' | 'middle' | 'high'
    task: string
    finished?: boolean
}

export type ToastProps = {
    isSuccess: boolean
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
    priority: string
    setDescription: React.Dispatch<React.SetStateAction<string>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    setPriority: React.Dispatch<React.SetStateAction<string>>
    setTask: React.Dispatch<React.SetStateAction<string>>
    setUpcomingTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
    task: string
}

export type handleCompleteTaskProps = {
    setCompletedTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    setUpcomingTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
    task: TaskProps
    completedTasks: TaskProps[]
    upcomingTasks: TaskProps[]
}

export type handleDeleteCompletedTaskProps = {
    setCompletedTasks: React.Dispatch<React.SetStateAction<TaskProps[] | []>>
    showToast: (props: ToastProps) => void
    task: TaskProps
    completedTasks: TaskProps[]
}
