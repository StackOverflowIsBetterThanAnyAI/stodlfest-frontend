import { SERVER_ADDRESS } from '../constants/constants'
import type { handleCompleteTaskProps, TaskProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleCompleteTask = async ({
    setCompletedTasks,
    setUpcomingTasks,
    showToast,
    task,
    completedTasks,
    upcomingTasks,
}: handleCompleteTaskProps) => {
    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/tasks/${task.id}/`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ finished: true }),
            }
        )

        if (!response.ok) {
            showToast({
                isSuccess: false,
                label: 'Aufgabe konnten nicht erledigt werden.',
            })
            return
        }

        const updatedTasks = upcomingTasks.filter(
            (item: TaskProps) => item.id !== task.id
        )
        setUpcomingTasks(updatedTasks)
        setItemInSessionStorage('upcomingTasks', updatedTasks)
        setCompletedTasks([task, ...completedTasks])
    } catch {
        showToast({
            isSuccess: false,
            label: 'Beim Erledigen dieser Aufgabe ist ein Fehler aufgetreten.',
        })
    }
}
