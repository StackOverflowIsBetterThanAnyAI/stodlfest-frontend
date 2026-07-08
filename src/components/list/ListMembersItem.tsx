import { useContext, useState } from 'react'
import ListButton from './ListButton'
import { useToast } from '../../context/ToastContext'
import type { ListMembersItemProps } from '../../types/types'
import { AllMembersContext } from '../../context/AllMembersContext'
import { handleDeleteMember } from '../../api/handleDeleteMember'

const ListMembersItem = ({ index, member }: ListMembersItemProps) => {
    const { showToast } = useToast()

    const allMembersContext = useContext(AllMembersContext)
    if (!allMembersContext) {
        throw new Error(
            'ListMembersItem must be used within a AllMembersContext.Provider'
        )
    }
    const [allMembers, setAllMembers] = allMembersContext

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const deleteMember = async () => {
        handleDeleteMember({
            allMembers,
            member,
            setAllMembers,
            setIsLoading,
            showToast,
        })
    }

    return (
        <div
            className={`py-2 px-3 flex flex-col gap-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm`}
        >
            <div className="flex flex-wrap gap-x-4 justify-between items-center">
                <span className="flex flex-col">
                    <span className="text-base md:text-lg">
                        {member.surname} {member.name}
                    </span>
                    <em className="text-sm md:text-base">
                        {member.age === 'ofLegalAge'
                            ? 'Volljährig'
                            : 'Minderjährig'}
                    </em>
                </span>
                {member?.job ? (
                    <span className="text-sm md:text-base">{member.job}</span>
                ) : (
                    <em className="text-sm md:text-base">keine Aufgabe</em>
                )}
            </div>
            <ListButton
                handleClick={deleteMember}
                isLoading={isLoading}
                label="Entfernen"
                type="regular"
            />
        </div>
    )
}

export default ListMembersItem
