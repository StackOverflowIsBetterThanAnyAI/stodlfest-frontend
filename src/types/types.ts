import type { ChangeEvent } from 'react'

export type FormHeaderProps = {
    label: string
}

export type FormRadioButtonProps = {
    id: string
    label: string
    value: string
    currentPriority: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export type ToastProps = {
    isSuccess: boolean
    label: string
}

export type ToastContextType = {
    showToast: (props: ToastProps) => void
    hideToast: () => void
}
