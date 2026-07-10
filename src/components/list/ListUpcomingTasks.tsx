import { useCallback, useContext, useEffect, useState } from 'react'
import { useToast } from '../../context/ToastContext'
import Header from '../header/Header'
import ListButton from './ListButton'
import ListNoItems from './ListNoItems'
import ListTask from './ListTask'
import { UpcomingTasksContext } from '../../context/UpcomingTasksContext'
import { handleFetchUpcomingTasks } from '../../api/handleFetchUpcomingTasks'
import { CompletedTasksContext } from '../../context/CompletedTasksContext'

const ListUpcomingTasks = () => {
    const { showToast } = useToast()

    const upcomingTasksContext = useContext(UpcomingTasksContext)
    if (!upcomingTasksContext) {
        throw new Error(
            'ListUpcomingTasks must be used within a UpcomingTasksContext.Provider'
        )
    }
    const [upcomingTasks, setUpcomingTasks] = upcomingTasksContext

    const completedTasksContext = useContext(CompletedTasksContext)
    if (!completedTasksContext) {
        throw new Error(
            'ListUpcomingTasks must be used within a CompletedTasksContext.Provider'
        )
    }
    const [completedTasks, setCompletedTasks] = completedTasksContext

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const fetchUpcomingTasks = useCallback(async () => {
        handleFetchUpcomingTasks({
            setCompletedTasks,
            setIsLoading,
            setUpcomingTasks,
            showToast,
        })
    }, [setCompletedTasks, setIsLoading, setUpcomingTasks, showToast])

    useEffect(() => {
        fetchUpcomingTasks()
    }, [fetchUpcomingTasks])

    return (
        <section className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full">
            <Header
                label={`Anstehende Aufgaben: ${upcomingTasks?.length || 0}`}
            />
            <ListButton
                handleClick={fetchUpcomingTasks}
                isLoading={isLoading}
                label="Neuladen"
                type="refresh"
            />
            {upcomingTasks?.length ? (
                <ListTask
                    allowComplete
                    allowEdit
                    ariaLabel="Anstehende Aufgaben"
                    setCompletedTasks={setCompletedTasks}
                    setUpcomingTasks={setUpcomingTasks}
                    completedTasks={completedTasks}
                    upcomingTasks={upcomingTasks}
                    showToast={showToast}
                    tasks={upcomingTasks}
                />
            ) : (
                <ListNoItems label="Es sind keine anstehenden Aufgaben vorhanden." />
            )}
        </section>
    )
}

export default ListUpcomingTasks
