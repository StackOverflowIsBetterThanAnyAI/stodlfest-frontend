import { useContext, useState } from 'react'
import Header from '../header/Header'
import ListButton from './ListButton'
import ListNoItems from './ListNoItems'
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
            <ListButton
                handleClick={fetchUpcomingTasks}
                isLoading={isLoading}
                label="Neuladen"
                type="refresh"
            />
            {completedTasks?.length ? (
                <ListTask
                    allowDelete
                    completedTasks={completedTasks}
                    setCompletedTasks={setCompletedTasks}
                    showToast={showToast}
                    tasks={completedTasks}
                />
            ) : (
                <ListNoItems label="Es sind noch keine erledigten Aufgaben vorhanden." />
            )}
        </section>
    )
}

export default ListCompletedTasks
