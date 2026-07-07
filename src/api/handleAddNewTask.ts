import { SERVER_ADDRESS } from '../constants/constants'
import type { handleAddNewTaskProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleAddNewTask = async ({
    e,
    description,
    priority,
    setDescription,
    setIsLoading,
    setIsSubmitDisabled,
    setPriority,
    setTask,
    setUpcomingTasks,
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

        const newTask = await response.json()
        setUpcomingTasks((prevTasks) => {
            const updatedTasks = [newTask, ...(prevTasks || [])]
            setItemInSessionStorage('upcomingTasks', updatedTasks)
            return updatedTasks
        })
    } catch {
        showToast({
            label: 'Beim Hinzufügen dieser Aufgabe ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
