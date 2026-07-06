import { useContext, useState } from 'react'
import { FetchLoading } from 'fetch-loading'
import Header from '../header/Header'
import ListTask from './ListTask'
import { handleFetchUpcomingTasks } from '../../api/handleFetchUpcomingTasks'
import { CompletedTasksContext } from '../../context/CompletedTasksContext'
import { UpcomingTasksContext } from '../../context/UpcomingTasksContext'
import { useToast } from '../../context/ToastContext'

const ListCompletedTasks = () => {
    const { showToast } = useToast()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const upcomingTasksContext = useContext(UpcomingTasksContext)
    if (!upcomingTasksContext) {
        throw new Error(
            'ListUpcomingTasks must be used within a UpcomingTasksContext.Provider'
        )
    }
    const [_upcomingTasks, setUpcomingTasks] = upcomingTasksContext

    const completedTasksContext = useContext(CompletedTasksContext)
    if (!completedTasksContext) {
        throw new Error(
            'ListUpcomingTasks must be used within a CompletedTasksContext.Provider'
        )
    }
    const [completedTasks, setCompletedTasks] = completedTasksContext

    const fetchUpcomingTasks = async () => {
        handleFetchUpcomingTasks({
            setCompletedTasks,
            setIsLoading,
            setUpcomingTasks,
            showToast,
        })
    }

    return (
        <section className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full">
            <Header label="Erledigte Aufgaben" />
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
            {completedTasks?.length ? (
                <ListTask
                    allowDelete
                    completedTasks={completedTasks}
                    setCompletedTasks={setCompletedTasks}
                    showToast={showToast}
                    tasks={completedTasks}
                />
            ) : undefined}
        </section>
    )
}

export default ListCompletedTasks
