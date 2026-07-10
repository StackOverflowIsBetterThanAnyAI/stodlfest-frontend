import { useCallback, useContext, useEffect, useState } from 'react'
import Header from '../header/Header'
import ListButton from './ListButton'
import ListJobs from './ListJobs'
import ListNoItems from './ListNoItems'
import { useToast } from '../../context/ToastContext'
import { AllJobsContext } from '../../context/AllJobsContext'
import { handleFetchAllJobs } from '../../api/handleFetchAllJobs'

const ListAllJobs = () => {
    const { showToast } = useToast()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const allJobsContext = useContext(AllJobsContext)
    if (!allJobsContext) {
        throw new Error(
            'ListAllJobs must be used within a AllJobsContext.Provider'
        )
    }
    const [allJobs, setAllJobs] = allJobsContext

    const fetchAllJobs = useCallback(async () => {
        handleFetchAllJobs({ setAllJobs, setIsLoading, showToast })
    }, [setAllJobs, setIsLoading, showToast])

    useEffect(() => {
        fetchAllJobs()
    }, [fetchAllJobs])

    return (
        <section className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full">
            <Header label={`Verfügbare Aufgaben: ${allJobs?.length || 0}`} />
            <ListButton
                handleClick={fetchAllJobs}
                isLoading={isLoading}
                label="Neuladen"
                type="refresh"
            />
            {allJobs?.length ? (
                <ListJobs allJobs={allJobs} ariaLabel="Verfügbare Aufgaben" />
            ) : (
                <ListNoItems label="Es sind keine Aufgaben vorhanden." />
            )}
        </section>
    )
}

export default ListAllJobs
