import { SERVER_ADDRESS } from '../constants/constants'
import type { handleFetchAllMembersProps, MemberProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleFetchAllMembers = async ({
    setAllMembers,
    setIsLoading,
    showToast,
}: handleFetchAllMembersProps) => {
    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/members/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            showToast({
                label: 'Mitglieder konnten nicht geladen werden.',
            })
            return
        }

        const memberData: MemberProps[] = await response.json()
        setAllMembers(memberData)
        setItemInSessionStorage('allMembers', memberData)
    } catch {
        showToast({
            label: 'Beim Laden der Mitglieder ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
