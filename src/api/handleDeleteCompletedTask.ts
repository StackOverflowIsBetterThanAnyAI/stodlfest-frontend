import { SERVER_ADDRESS } from '../constants/constants'
import type { handleDeleteCompletedTaskProps, TaskProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleDeleteCompletedTask = async ({
    accessToken,
    navigate,
    setCompletedTasks,
    setIsLoading,
    setIsLoggedIn,
    showToast,
    task,
    completedTasks,
}: handleDeleteCompletedTaskProps) => {
    setIsLoading(true)

    try {
        const response = await fetch(
            `${SERVER_ADDRESS}/api/tasks/${task.id}/`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ finished: true }),
            }
        )

        if (response.status === 401) {
            showToast({
                label: 'Nutzersession ungültig. Bitte melde Dich erneut an.',
            })
            setIsLoggedIn(false)
            setItemInSessionStorage('isLoggedIn', false)
            navigate('/')
            return
        }

        if (!response.ok) {
            showToast({
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
            label: 'Beim Löschen dieser Aufgabe ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
