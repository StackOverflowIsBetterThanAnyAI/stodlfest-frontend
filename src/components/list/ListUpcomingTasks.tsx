import { useCallback, useContext, useEffect, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import { useToast } from '../../context/ToastContext'
import Header from '../header/Header'
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
            <Header label="Anstehende Aufgaben" />
            {isLoading ? (
                <div className="rounded-lg outline-2 outline-zinc-500 max-w-32 w-full h-8 md:h-10 px-4 py-1 mx-auto flex justify-center items-center">
                    <FetchLoading theme="#71717b" />
                </div>
            ) : (
                <button
                    onClick={fetchUpcomingTasks}
                    className="primary-text-pseudo text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-32 w-full h-8 md:h-10 px-4 py-1 mx-auto"
                >
                    Refresh
                </button>
            )}
            {upcomingTasks?.length ? (
                <ListTask
                    allowComplete
                    allowEdit
                    setCompletedTasks={setCompletedTasks}
                    setUpcomingTasks={setUpcomingTasks}
                    completedTasks={completedTasks}
                    upcomingTasks={upcomingTasks}
                    showToast={showToast}
                    tasks={upcomingTasks}
                />
            ) : undefined}
        </section>
    )
}

export default ListUpcomingTasks
