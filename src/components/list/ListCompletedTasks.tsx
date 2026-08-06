import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../header/Header'
import ListButton from './ListButton'
import ListNoItems from './ListNoItems'
import ListTask from './ListTask'
import { handleFetchUpcomingTasks } from '../../api/handleFetchUpcomingTasks'
import { CompletedTasksContext } from '../../context/CompletedTasksContext'
import { IsLoggedInContext } from '../../context/IsLoggedInContext'
import { useToast } from '../../context/ToastContext'
import { UpcomingTasksContext } from '../../context/UpcomingTasksContext'
import { getStoredLocalData } from '../../utils/getStoredLocalData'
import { setItemInLocalStorage } from '../../utils/setItemInLocalStorage'

const ListCompletedTasks = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const upcomingTasksContext = useContext(UpcomingTasksContext)
    if (!upcomingTasksContext) {
        throw new Error(
            'ListCompletedTasks must be used within a UpcomingTasksContext.Provider'
        )
    }
    const [_upcomingTasks, setUpcomingTasks] = upcomingTasksContext

    const completedTasksContext = useContext(CompletedTasksContext)
    if (!completedTasksContext) {
        throw new Error(
            'ListCompletedTasks must be used within a CompletedTasksContext.Provider'
        )
    }
    const [completedTasks, setCompletedTasks] = completedTasksContext

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error(
            'ListCompletedTasks must be used within a IsLoggedInContext.Provider'
        )
    }
    const [_isLoggedIn, setIsLoggedIn] = isLoggedInContext

    const fetchUpcomingTasks = async () => {
        const parsedLocalData = getStoredLocalData()
        const accessToken = (() => {
            const data = parsedLocalData?.accessToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('accessToken', '')
            return ''
        })()
        const refreshToken = (() => {
            const data = parsedLocalData?.refreshToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('refreshToken', '')
            return ''
        })()

        handleFetchUpcomingTasks({
            accessToken,
            navigate,
            refreshToken,
            setCompletedTasks,
            setIsLoading,
            setIsLoggedIn,
            setUpcomingTasks,
            showToast,
        })
    }

    return (
        <section className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full bg-slate-900">
            <Header
                label={`Erledigte Aufgaben: ${completedTasks?.length || 0}`}
            />
            <ListButton
                handleClick={fetchUpcomingTasks}
                isLoading={isLoading}
                label="Neuladen"
                type="refresh"
            />
            {completedTasks?.length ? (
                <ListTask
                    allowDelete
                    allowRestore
                    ariaLabel="Erledigte Aufgaben"
                    completedTasks={completedTasks}
                    setCompletedTasks={setCompletedTasks}
                    tasks={completedTasks}
                />
            ) : (
                <ListNoItems label="Es sind keine erledigten Aufgaben vorhanden." />
            )}
        </section>
    )
}

export default ListCompletedTasks
