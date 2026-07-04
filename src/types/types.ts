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
}

export type ToastProps = {
    isSuccess: boolean
    label: string
}

export type ToastContextType = {
    showToast: (props: ToastProps) => void
    hideToast: () => void
}
