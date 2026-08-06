import { useState, useContext, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../header/Header'
import ListAssignJob from './ListAssignJob'
import ListButton from './ListButton'
import ListNoItems from './ListNoItems'
import { handleFetchAllJobs } from '../../api/handleFetchAllJobs'
import { handleFetchAllMembers } from '../../api/handleFetchAllMembers'
import { AllJobsContext } from '../../context/AllJobsContext'
import { AllMembersContext } from '../../context/AllMembersContext'
import { IsLoggedInContext } from '../../context/IsLoggedInContext'
import { useToast } from '../../context/ToastContext'
import { getStoredLocalData } from '../../utils/getStoredLocalData'
import { setItemInLocalStorage } from '../../utils/setItemInLocalStorage'

const ListAssignJobs = () => {
    const navigate = useNavigate()
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

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error(
            'ListAssignJob must be used within a IsLoggedInContext.Provider'
        )
    }
    const [_isLoggedIn, setIsLoggedIn] = isLoggedInContext

    const fetchAllJobsAndMembers = useCallback(async () => {
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

        handleFetchAllJobs({
            accessToken,
            navigate,
            refreshToken,
            setAllJobs,
            setIsLoading,
            setIsLoggedIn,
            showToast,
        })
        handleFetchAllMembers({
            accessToken,
            navigate,
            refreshToken,
            setAllMembers,
            setIsLoading,
            setIsLoggedIn,
            showToast,
        })
    }, [
        navigate,
        setAllJobs,
        setAllMembers,
        setIsLoading,
        setIsLoggedIn,
        showToast,
    ])

    useEffect(() => {
        fetchAllJobsAndMembers()
    }, [fetchAllJobsAndMembers])

    return (
        <section className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full bg-slate-900">
            <Header label={`Verfügbare Aufgaben: ${allJobs?.length || 0}`} />
            <ListButton
                handleClick={fetchAllJobsAndMembers}
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
