import { SERVER_ADDRESS } from '../constants/constants'
import type { handleApplyUpdateProps, TaskProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleApplyUpdate = async ({
    setIsEdit,
    setUpcomingTasks,
    showToast,
    task,
    upcomingTasks,
    updatedDescription,
    updatedTask,
}: handleApplyUpdateProps) => {
    if (task.task === updatedTask && task.description === updatedDescription) {
        setIsEdit(false)
        return
    }

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
                }),
            }
        )

        if (!response.ok) {
            showToast({
                isSuccess: false,
                label: 'Aufgaben konnten nicht erledigt werden.',
            })
            return
        }

        const updatedTasks = upcomingTasks!.map((item: TaskProps) => {
            if (item.id === task.id) {
                return {
                    ...item,
                    task: updatedTask,
                    description: updatedDescription,
                }
            }
            return item
        })
        setUpcomingTasks(updatedTasks)
        setItemInSessionStorage('upcomingTasks', updatedTasks)
        setIsEdit(false)
    } catch {
        showToast({
            isSuccess: false,
            label: 'Beim Löschen dieser Aufgabe ist ein Fehler aufgetreten.',
        })
    }
}
