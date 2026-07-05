import { useContext, useState } from 'react'
import Header from '../header/Header'
import { handleFetchUpcomingTasks } from '../../api/handleFetchUpcomingTasks'
import { FetchLoading } from 'fetch-loading'
import { CompletedTasksContext } from '../../context/CompletedTasksContext'
import { UpcomingTasksContext } from '../../context/UpcomingTasksContext'
import { useToast } from '../../context/ToastContext'
import { handleDeleteCompletedTask } from '../../api/handleDeleteCompletedTask'

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
                    className="secondary-text-pseudo text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-32 w-full h-8 md:h-10 px-4 py-1 mx-auto"
                >
                    Refresh
                </button>
            )}
            {completedTasks?.length ? (
                <ul className="flex flex-col gap-4 mx-2">
                    {completedTasks.map((task, id) => (
                        <li
                            key={task.id}
                            className={`flex flex-col ${id < completedTasks.length - 1 ? 'pb-4 border-b-2' : ''} border-zinc-200`}
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
                                        onClick={() =>
                                            handleDeleteCompletedTask({
                                                setCompletedTasks,
                                                showToast,
                                                task,
                                                completedTasks,
                                            })
                                        }
                                        className="secondary-text-pseudo text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto"
                                    >
                                        Löschen
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

export default ListCompletedTasks
