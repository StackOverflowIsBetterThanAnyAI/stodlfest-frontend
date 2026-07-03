import { SERVER_ADDRESS } from '../constants/constants'
import type { ToastProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

type handleAddNewTaskProps = {
    e: React.FormEvent<HTMLFormElement>
    description: string
    priority: string
    setDescription: React.Dispatch<React.SetStateAction<string>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    setIsSubmitDisabled: (value: React.SetStateAction<boolean>) => void
    setPriority: React.Dispatch<React.SetStateAction<string>>
    setTask: React.Dispatch<React.SetStateAction<string>>
    showToast: (props: ToastProps) => void
    task: string
}

export const handleAddNewTask = async ({
    e,
    description,
    priority,
    setDescription,
    setIsLoading,
    setIsSubmitDisabled,
    setPriority,
    setTask,
    showToast,
    task,
}: handleAddNewTaskProps) => {
    e.preventDefault()

    const taskData = {
        task,
        description,
        priority,
    }

    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/tasks/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            const error = errorData.task.join(' ')
            showToast({
                isSuccess: false,
                label: error,
            })
            return
        }

        setTask('')
        setDescription('')
        setPriority('middle')
        setIsSubmitDisabled(true)
        setItemInSessionStorage('taskAdd', '')
        setItemInSessionStorage('descriptionAdd', '')
        setItemInSessionStorage('priorityAdd', 'middle')
    } catch {
        showToast({
            isSuccess: false,
            label: 'Beim Hinzufügen dieser Aufgabe ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
