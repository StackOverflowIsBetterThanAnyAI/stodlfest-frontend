import { useCallback, useContext, useEffect, useState } from 'react'
import { useToast } from '../../context/ToastContext'
import Header from '../header/Header'
import { FetchLoading } from 'fetch-loading'
import { handleCompleteTask } from '../../api/handleCompleteTask'
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
    const [_completedTasks, setCompletedTasks] = completedTasksContext

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
                    className="secondary-text-pseudo text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-32 w-full h-8 md:h-10 px-4 py-1 mx-auto"
                >
                    Refresh
                </button>
            )}
            {upcomingTasks?.length ? (
                <ul className="flex flex-col gap-4 mx-2">
                    {upcomingTasks.map((task, id) => (
                        <li
                            key={task.id}
                            className={`flex flex-col ${id < upcomingTasks.length - 1 ? 'pb-4 border-b-2' : ''} border-zinc-200`}
                        >
                            <div
                                className={`py-2 px-3 flex flex-col gap-2 ${id % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm`}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-base md:text-lg">
                                        {task.task}
                                    </h3>
                                    <span className="text-sm md:text-base">
                                        {task.priority}
                                    </span>
                                </div>
                                {task?.description?.length ? (
                                    <em className="text-sm md:text-base line-clamp-3 break-words">
                                        {task.description}
                                    </em>
                                ) : undefined}
                                <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                                    <button
                                        onClick={fetchUpcomingTasks}
                                        className="secondary-text-pseudo text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto"
                                    >
                                        Bearbeiten
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleCompleteTask({
                                                setUpcomingTasks,
                                                showToast,
                                                task,
                                                upcomingTasks,
                                            })
                                        }
                                        className="secondary-text-pseudo text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto"
                                    >
                                        Erledigt
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : undefined}
        </section>
    )
}

export default ListUpcomingTasks
