import { SERVER_ADDRESS } from '../constants/constants'
import type { handleRestoreCompletedTaskProps, TaskProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleRestoreCompletedTask = async ({
    setCompletedTasks,
    setIsLoading,
    setUpcomingTasks,
    showToast,
    task,
    completedTasks,
}: handleRestoreCompletedTaskProps) => {
    setIsLoading(true)

    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/tasks/${task.id}/`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ finished: false }),
            }
        )

        if (!response.ok) {
            showToast({
                label: 'Aufgabe konnten nicht wiederhergestellt werden.',
            })
            return
        }

        const updatedCompletedTasks = completedTasks.filter(
            (item: TaskProps) => item.id !== task.id
        )
        setCompletedTasks(updatedCompletedTasks)
        setItemInSessionStorage('completedTasks', updatedCompletedTasks)

        const newTask = await response.json()
        setUpcomingTasks((prevTasks) => {
            const updatedTasks = [newTask, ...(prevTasks || [])]
            setItemInSessionStorage('upcomingTasks', updatedTasks)
            return updatedTasks
        })
    } catch {
        showToast({
            label: 'Beim Wiederherstellen dieser Aufgabe ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
