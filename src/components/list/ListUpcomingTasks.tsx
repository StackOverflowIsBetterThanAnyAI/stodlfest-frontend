import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import Header from '../header/Header'
import ListButton from './ListButton'
import ListNoItems from './ListNoItems'
import ListTask from './ListTask'
import { handleFetchUpcomingTasks } from '../../api/handleFetchUpcomingTasks'
import { CompletedTasksContext } from '../../context/CompletedTasksContext'
import { IsLoggedInContext } from '../../context/IsLoggedInContext'
import { UpcomingTasksContext } from '../../context/UpcomingTasksContext'
import { getStoredLocalData } from '../../utils/getStoredLocalData'
import { setItemInLocalStorage } from '../../utils/setItemInLocalStorage'

const ListUpcomingTasks = () => {
    const navigate = useNavigate()
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

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error(
            'ListUpcomingTasks must be used within a IsLoggedInContext.Provider'
        )
    }
    const [_isLoggedIn, setIsLoggedIn] = isLoggedInContext

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const fetchUpcomingTasks = useCallback(async () => {
        const accessToken = (() => {
            const parsedLocalData = getStoredLocalData()
            const data = parsedLocalData?.accessToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('accessToken', '')
            return ''
        })()

        handleFetchUpcomingTasks({
            accessToken,
            navigate,
            setCompletedTasks,
            setIsLoading,
            setIsLoggedIn,
            setUpcomingTasks,
            showToast,
        })
    }, [
        navigate,
        setCompletedTasks,
        setIsLoading,
        setIsLoggedIn,
        setUpcomingTasks,
        showToast,
    ])

    useEffect(() => {
        fetchUpcomingTasks()
    }, [fetchUpcomingTasks])

    return (
        <section className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full bg-slate-900">
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
                    tasks={upcomingTasks}
                />
            ) : (
                <ListNoItems label="Es sind keine anstehenden Aufgaben vorhanden." />
            )}
        </section>
    )
}

export default ListUpcomingTasks
