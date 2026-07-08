import { useCallback, useContext, useEffect, useState } from 'react'
import Header from '../header/Header'
import ListButton from './ListButton'
import ListMembers from './ListMembers'
import ListNoItems from './ListNoItems'
import { AllMembersContext } from '../../context/AllMembersContext'
import { useToast } from '../../context/ToastContext'
import { handleFetchAllMembers } from '../../api/handleFetchAllMembers'

const ListAllMembers = () => {
    const { showToast } = useToast()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const allMembersContext = useContext(AllMembersContext)
    if (!allMembersContext) {
        throw new Error(
            'ListAllMembers must be used within a AllMembersContext.Provider'
        )
    }
    const [allMembers, setAllMembers] = allMembersContext

    const fetchAllMembers = useCallback(async () => {
        handleFetchAllMembers({ setAllMembers, setIsLoading, showToast })
    }, [setAllMembers, setIsLoading, showToast])

    useEffect(() => {
        fetchAllMembers()
    }, [fetchAllMembers])

    return (
        <section className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full">
            <Header label="Anwesende Mitglieder" />
            <ListButton
                handleClick={fetchAllMembers}
                isLoading={isLoading}
                label="Neuladen"
                type="refresh"
            />
            {allMembers?.length ? (
                <ListMembers allMembers={allMembers} />
            ) : (
                <ListNoItems label="Es sind noch keine Mitglieder vorhanden." />
            )}
        </section>
    )
}

export default ListAllMembers
