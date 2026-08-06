import { SERVER_ADDRESS } from '../constants/constants'
import type { handleDeleteMemberProps, MemberProps } from '../types/types'
import { getValidAccessToken } from '../utils/getValidAccessToken'
import { setItemInLocalStorage } from '../utils/setItemInLocalStorage'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleDeleteMember = async ({
    accessToken,
    allMembers,
    member,
    navigate,
    refreshToken,
    setAllMembers,
    setIsLoading,
    setIsLoggedIn,
    showToast,
}: handleDeleteMemberProps) => {
    try {
        setIsLoading(true)

        const response = await fetch(
            `${SERVER_ADDRESS}/api/members/${member.id}/`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${await getValidAccessToken({ accessToken, refreshToken })}`,
                    'Content-Type': 'application/json',
                },
            }
        )

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
                label: 'Mitglied konnte nicht entfernt werden.',
            })
            return
        }

        const updatedMembers =
            allMembers?.filter((item: MemberProps) => item.id !== member.id) ||
            []
        setAllMembers(updatedMembers)
        setItemInSessionStorage('allMembers', updatedMembers)
    } catch {
        showToast({
            label: 'Beim Entfernen des Mitglieds ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
