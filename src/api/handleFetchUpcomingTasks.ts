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
                label: 'Aufgaben konnten nicht geladen werden.',
            })
            return
        }

        const taskData: TaskProps[] = await response.json()
        const { completedTasks, upcomingTasks } = taskData.reduce(
            (total, task: TaskProps) => {
                if (task.finished) {
                    total.completedTasks.push(task)
                } else {
                    total.upcomingTasks.push(task)
                }
                return total
            },
            {
                completedTasks: [] as TaskProps[],
                upcomingTasks: [] as TaskProps[],
            }
        )
        setCompletedTasks(completedTasks)
        setUpcomingTasks(upcomingTasks)
        setItemInSessionStorage('completedTasks', completedTasks)
        setItemInSessionStorage('upcomingTasks', upcomingTasks)
    } catch {
        showToast({
            label: 'Beim Laden der Aufgaben ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
