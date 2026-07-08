import { useCallback, useContext, useEffect, useState } from 'react'
import Header from '../header/Header'
import ListButton from './ListButton'
import ListNoItems from './ListNoItems'
import { AllMembersContext } from '../../context/AllMembersContext'
import { useToast } from '../../context/ToastContext'
import { handleFetchAllMembers } from '../../api/handleFetchAllMembers'
import type { MemberProps } from '../../types/types'

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
                <ul className="flex flex-col gap-4 mx-2">
                    {allMembers.map((member: MemberProps, index: number) => (
                        <li
                            key={member.id}
                            className={`flex flex-col ${index < allMembers.length - 1 ? 'pb-4 border-b-2' : ''} border-zinc-200`}
                        >
                            <div
                                className={`py-2 px-3 flex flex-col gap-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm`}
                            >
                                <div className="flex flex-wrap gap-2 justify-between items-center">
                                    <span className="text-base md:text-lg">
                                        {member.name} {member.surname}
                                    </span>
                                    <em className="text-sm md:text-base">
                                        {member.age === 'ofLegalAge'
                                            ? 'Volljährig'
                                            : 'Minderjährig'}
                                    </em>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <ListNoItems label="Es sind noch keine Mitglieder vorhanden." />
            )}
        </section>
    )
}

export default ListAllMembers
