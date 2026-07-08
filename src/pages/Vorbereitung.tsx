import { useState } from 'react'
import FormNewTask from '../components/form/FormNewTask'
import HeaderMain from '../components/header/HeaderMain'
import ListCompletedTasks from '../components/list/ListCompletedTasks'
import ListUpcomingTasks from '../components/list/ListUpcomingTasks'
import type { TaskProps } from '../types/types'
import { UpcomingTasksContext } from '../context/UpcomingTasksContext'
import { CompletedTasksContext } from '../context/CompletedTasksContext'
import { getStoredSessionData } from '../utils/getStoredSessionData'

const Vorbereitung = () => {
    const parsedSessionData = getStoredSessionData()

    const [completedTasks, setCompletedTasks] = useState<TaskProps[]>(
        (parsedSessionData?.completedTasks as TaskProps[]) || []
    )
    const [upcomingTasks, setUpcomingTasks] = useState<TaskProps[]>(
        (parsedSessionData?.upcomingTasks as TaskProps[]) || []
    )

    return (
        <main className="max-w-7xl w-full mx-auto items-center p-8 flex flex-col gap-8 xs:gap-16">
            <CompletedTasksContext.Provider
                value={[completedTasks, setCompletedTasks]}
            >
                <UpcomingTasksContext.Provider
                    value={[upcomingTasks, setUpcomingTasks]}
                >
                    <HeaderMain label="Vorbereitungen" />
                    <ListUpcomingTasks />
                    <ListCompletedTasks />
                    <FormNewTask />
                </UpcomingTasksContext.Provider>
            </CompletedTasksContext.Provider>
        </main>
    )
}

export default Vorbereitung
