import { useState, useContext, useCallback, useEffect } from 'react'
import Header from '../header/Header'
import ListButton from './ListButton'
import ListNoItems from './ListNoItems'
import { handleFetchAllJobs } from '../../api/handleFetchAllJobs'
import { AllJobsContext } from '../../context/AllJobsContext'
import { useToast } from '../../context/ToastContext'
import ListAssignJob from './ListAssignJob'
import { handleFetchAllMembers } from '../../api/handleFetchAllMembers'
import { AllMembersContext } from '../../context/AllMembersContext'

const ListAssignJobs = () => {
    const { showToast } = useToast()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const allJobsContext = useContext(AllJobsContext)
    if (!allJobsContext) {
        throw new Error(
            'ListAssignJob must be used within a AllJobsContext.Provider'
        )
    }
    const [allJobs, setAllJobs] = allJobsContext

    const allMembersContext = useContext(AllMembersContext)
    if (!allMembersContext) {
        throw new Error(
            'ListAssignJob must be used within a AllMembersContext.Provider'
        )
    }
    const [_allMembers, setAllMembers] = allMembersContext

    const fetchAllJobs = useCallback(async () => {
        handleFetchAllJobs({ setAllJobs, setIsLoading, showToast })
    }, [setAllJobs, setIsLoading, showToast])

    const fetchAllMembers = useCallback(async () => {
        handleFetchAllMembers({ setAllMembers, setIsLoading, showToast })
    }, [setAllMembers, setIsLoading, showToast])

    useEffect(() => {
        fetchAllJobs()
        fetchAllMembers()
    }, [fetchAllJobs, fetchAllMembers])

    return (
        <section className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full bg-slate-900">
            <Header label={`Verfügbare Aufgaben: ${allJobs?.length || 0}`} />
            <ListButton
                handleClick={fetchAllJobs}
                isLoading={isLoading}
                label="Neuladen"
                type="refresh"
            />
            {allJobs?.length ? (
                <ListAssignJob
                    allJobs={allJobs}
                    ariaLabel="Verfügbare Aufgaben"
                />
            ) : (
                <ListNoItems label="Es sind keine Aufgaben vorhanden." />
            )}
        </section>
    )
}

export default ListAssignJobs
