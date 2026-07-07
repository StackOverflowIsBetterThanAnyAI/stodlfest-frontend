import { SERVER_ADDRESS } from '../constants/constants'
import type { handleDeleteCompletedTaskProps, TaskProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleDeleteCompletedTask = async ({
    setCompletedTasks,
    showToast,
    task,
    completedTasks,
}: handleDeleteCompletedTaskProps) => {
    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/tasks/${task.id}/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ finished: true }),
            }
        )

        if (!response.ok) {
            showToast({
                isSuccess: false,
                label: 'Aufgabe konnten nicht gelöscht werden.',
            })
            return
        }

        const updatedTasks = completedTasks.filter(
            (item: TaskProps) => item.id !== task.id
        )
        setCompletedTasks(updatedTasks)
        setItemInSessionStorage('completedTasks', updatedTasks)
    } catch {
        showToast({
            isSuccess: false,
            label: 'Beim Löschen dieser Aufgabe ist ein Fehler aufgetreten.',
        })
    }
}
