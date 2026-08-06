import { SERVER_ADDRESS } from '../constants/constants'
import type { handleFetchAllMembersProps, MemberProps } from '../types/types'
import { setItemInLocalStorage } from '../utils/setItemInLocalStorage'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleFetchAllMembers = async ({
    accessToken,
    navigate,
    setAllMembers,
    setIsLoading,
    setIsLoggedIn,
    showToast,
}: handleFetchAllMembersProps) => {
    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/members/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 401) {
            showToast({
                label: 'Nutzersession ungültig. Bitte melde Dich erneut an.',
            })
            setIsLoggedIn(false)
            setItemInLocalStorage('isLoggedIn', false)
            navigate('/')
            return
        }

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
