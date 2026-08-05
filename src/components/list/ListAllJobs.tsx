import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../header/Header'
import ListButton from './ListButton'
import ListJobs from './ListJobs'
import ListNoItems from './ListNoItems'
import { handleFetchAllJobs } from '../../api/handleFetchAllJobs'
import { AllJobsContext } from '../../context/AllJobsContext'
import { IsLoggedInContext } from '../../context/IsLoggedInContext'
import { useToast } from '../../context/ToastContext'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'

const ListAllJobs = () => {
    const parsedSessionData = getStoredSessionData()
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const allJobsContext = useContext(AllJobsContext)
    if (!allJobsContext) {
        throw new Error(
            'ListAllJobs must be used within a AllJobsContext.Provider'
        )
    }
    const [allJobs, setAllJobs] = allJobsContext

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error(
            'ListAllJobs must be used within a IsLoggedInContext.Provider'
        )
    }
    const [_isLoggedIn, setIsLoggedIn] = isLoggedInContext

    const [accessToken, _setAccessToken] = useState<string>(() => {
        const data = parsedSessionData?.accessToken
        if (data?.length && typeof data === 'string') {
            return data
        }
        setItemInSessionStorage('accessToken', '')
        return ''
    })

    const fetchAllJobs = useCallback(async () => {
        handleFetchAllJobs({
            accessToken,
            navigate,
            setAllJobs,
            setIsLoading,
            setIsLoggedIn,
            showToast,
        })
    }, [
        accessToken,
        navigate,
        setAllJobs,
        setIsLoading,
        setIsLoggedIn,
        showToast,
    ])

    useEffect(() => {
        fetchAllJobs()
    }, [fetchAllJobs])

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
                <ListJobs allJobs={allJobs} ariaLabel="Verfügbare Aufgaben" />
            ) : (
                <ListNoItems label="Es sind keine Aufgaben vorhanden." />
            )}
        </section>
    )
}

export default ListAllJobs
