import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../header/Header'
import ListButton from './ListButton'
import ListMembers from './ListMembers'
import ListNoItems from './ListNoItems'
import { handleFetchAllMembers } from '../../api/handleFetchAllMembers'
import { AllMembersContext } from '../../context/AllMembersContext'
import { IsLoggedInContext } from '../../context/IsLoggedInContext'
import { useToast } from '../../context/ToastContext'
import { getStoredLocalData } from '../../utils/getStoredLocalData'
import { setItemInLocalStorage } from '../../utils/setItemInLocalStorage'

const ListAllMembers = () => {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const allMembersContext = useContext(AllMembersContext)
    if (!allMembersContext) {
        throw new Error(
            'ListAllMembers must be used within a AllMembersContext.Provider'
        )
    }
    const [allMembers, setAllMembers] = allMembersContext

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error(
            'ListAllMembers must be used within a IsLoggedInContext.Provider'
        )
    }
    const [_isLoggedIn, setIsLoggedIn] = isLoggedInContext

    const fetchAllMembers = useCallback(async () => {
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

        handleFetchAllMembers({
            accessToken,
            navigate,
            refreshToken,
            setAllMembers,
            setIsLoading,
            setIsLoggedIn,
            showToast,
        })
    }, [navigate, setAllMembers, setIsLoading, setIsLoggedIn, showToast])

    useEffect(() => {
        fetchAllMembers()
    }, [fetchAllMembers])

    return (
        <section className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full bg-slate-900">
            <Header
                label={`Anwesende Mitglieder: ${allMembers?.length || 0}`}
            />
            <ListButton
                handleClick={fetchAllMembers}
                isLoading={isLoading}
                label="Neuladen"
                type="refresh"
            />
            {allMembers?.length ? (
                <ListMembers
                    allMembers={allMembers}
                    ariaLabel="Anwesende Mitglieder"
                />
            ) : (
                <ListNoItems label="Es sind keine Mitglieder vorhanden." />
            )}
        </section>
    )
}

export default ListAllMembers
