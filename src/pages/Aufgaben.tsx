import { useState } from 'react'
import FormNewJob from '../components/form/FormNewJob'
import HeaderMain from '../components/header/HeaderMain'
import ListAllJobs from '../components/list/ListAllJobs'
import { AllJobsContext } from '../context/AllJobsContext'
import { getStoredSessionData } from '../utils/getStoredSessionData'
import type { JobProps } from '../types/types'

const Aufgaben = () => {
    const parsedSessionData = getStoredSessionData()

    const [allJobs, setAllJobs] = useState<JobProps[]>(
        (parsedSessionData?.allJobs as JobProps[]) || []
    )

    return (
        <main className="max-w-7xl w-full mx-auto items-center p-4 md:p-8 flex flex-col gap-8 xs:gap-16">
            <AllJobsContext.Provider value={[allJobs, setAllJobs]}>
                <HeaderMain label="Aufgaben" />
                <ListAllJobs />
                <FormNewJob />
            </AllJobsContext.Provider>
        </main>
    )
}

export default Aufgaben
