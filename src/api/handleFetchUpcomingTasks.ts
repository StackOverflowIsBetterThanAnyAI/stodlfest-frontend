import { SERVER_ADDRESS } from '../constants/constants'
import type { handleFetchUpcomingTasksProps, TaskProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleFetchUpcomingTasks = async ({
    setCompletedTasks,
    setIsLoading,
    setUpcomingTasks,
    showToast,
}: handleFetchUpcomingTasksProps) => {
    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/tasks/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            showToast({
                isSuccess: false,
                label: 'Aufgaben konnten nicht geladen werden.',
            })
            return
        }

        const taskData: TaskProps[] = await response.json()
        const completedTasks = taskData.filter(
            (task: TaskProps) => task.finished
        )
        const upcomingTasks = taskData.filter(
            (task: TaskProps) => !task.finished
        )
        setCompletedTasks(completedTasks)
        setUpcomingTasks(upcomingTasks)
        setItemInSessionStorage('completedTasks', completedTasks)
        setItemInSessionStorage('upcomingTasks', upcomingTasks)
    } catch {
        showToast({
            isSuccess: false,
            label: 'Beim Laden der Aufgaben ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
