import { useState } from 'react'
import HeaderMain from '../components/header/HeaderMain'
import ListAssignJobs from '../components/list/ListAssignJobs'
import { AllJobsContext } from '../context/AllJobsContext'
import type { JobProps, MemberProps } from '../types/types'
import { getStoredSessionData } from '../utils/getStoredSessionData'
import { AllMembersContext } from '../context/AllMembersContext'

const Arbeitseinteilung = () => {
    const parsedSessionData = getStoredSessionData()

    const [allJobs, setAllJobs] = useState<JobProps[]>(
        (parsedSessionData?.allJobs as JobProps[]) || []
    )
    const [allMembers, setAllMembers] = useState<MemberProps[]>(
        (parsedSessionData?.allMembers as MemberProps[]) || []
    )

    return (
        <main className="max-w-7xl w-full mx-auto items-center p-4 md:p-8 flex flex-col gap-8 xs:gap-16">
            <AllJobsContext.Provider value={[allJobs, setAllJobs]}>
                <AllMembersContext.Provider value={[allMembers, setAllMembers]}>
                    <HeaderMain label="Arbeitseinteilung" />
                    <ListAssignJobs />
                </AllMembersContext.Provider>
            </AllJobsContext.Provider>
        </main>
    )
}

export default Arbeitseinteilung
