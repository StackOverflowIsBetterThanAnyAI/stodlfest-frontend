import { SERVER_ADDRESS } from '../constants/constants'
import type { handleRestoreCompletedTaskProps, TaskProps } from '../types/types'
import { setItemInLocalStorage } from '../utils/setItemInLocalStorage'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleRestoreCompletedTask = async ({
    accessToken,
    completedTasks,
    navigate,
    setCompletedTasks,
    setIsLoading,
    setIsLoggedIn,
    setUpcomingTasks,
    showToast,
    task,
}: handleRestoreCompletedTaskProps) => {
    setIsLoading(true)

    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/tasks/${task.id}/`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ finished: false }),
            }
        )

        if (response.status === 401) {
            showToast({
                label: 'Nutzersession ungültig. Bitte melde Dich erneut an.',
            })
            setIsLoggedIn(false)
            setItemInLocalStorage('isLoggedIn', false)
            navigate('/')
            return
        }

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
