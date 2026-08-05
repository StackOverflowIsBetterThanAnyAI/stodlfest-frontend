import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListButton from './ListButton'
import { handleDeleteMember } from '../../api/handleDeleteMember'
import { AllMembersContext } from '../../context/AllMembersContext'
import { IsLoggedInContext } from '../../context/IsLoggedInContext'
import { useToast } from '../../context/ToastContext'
import type { ListMembersItemProps } from '../../types/types'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'

const ListMembersItem = ({ index, member }: ListMembersItemProps) => {
    const parsedSessionData = getStoredSessionData()
    const navigate = useNavigate()
    const { showToast } = useToast()

    const allMembersContext = useContext(AllMembersContext)
    if (!allMembersContext) {
        throw new Error(
            'ListMembersItem must be used within a AllMembersContext.Provider'
        )
    }
    const [allMembers, setAllMembers] = allMembersContext

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error(
            'ListMembersItem must be used within a IsLoggedInContext.Provider'
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

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const deleteMember = async () => {
        handleDeleteMember({
            accessToken,
            allMembers,
            member,
            navigate,
            setAllMembers,
            setIsLoading,
            setIsLoggedIn,
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
                index={0}
            />
        </div>
    )
}

export default ListMembersItem
