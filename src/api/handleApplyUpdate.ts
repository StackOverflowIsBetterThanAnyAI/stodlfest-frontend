import { SERVER_ADDRESS } from '../constants/constants'
import type { handleApplyUpdateProps, TaskProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleApplyUpdate = async ({
    setIsEdit,
    setIsLoading,
    setUpcomingTasks,
    showToast,
    task,
    upcomingTasks,
    updatedDescription,
    updatedPriority,
    updatedTask,
}: handleApplyUpdateProps) => {
    if (
        task.task === updatedTask &&
        task.description === updatedDescription &&
        task.priority === updatedPriority
    ) {
        setIsEdit(false)
        return
    }

    setIsLoading(true)

    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/tasks/${task.id}/`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: updatedTask,
                    description: updatedDescription,
                    priority: updatedPriority,
                }),
            }
        )

        if (!response.ok) {
            showToast({
                label: 'Aufgabe konnten nicht aktualisiert werden.',
            })
            return
        }

        const updatedTasks = upcomingTasks!.map((item: TaskProps) => {
            if (item.id === task.id) {
                return {
                    ...item,
                    task: updatedTask,
                    description: updatedDescription,
                    priority: updatedPriority,
                }
            }
            return item
        })
        setUpcomingTasks(updatedTasks)
        setItemInSessionStorage('upcomingTasks', updatedTasks)
        setIsEdit(false)
    } catch {
        showToast({
            label: 'Beim Aktualisieren dieser Aufgabe ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
