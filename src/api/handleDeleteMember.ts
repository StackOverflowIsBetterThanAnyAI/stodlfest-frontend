import { SERVER_ADDRESS } from '../constants/constants'
import type { handleDeleteMemberProps, MemberProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleDeleteMember = async ({
    allMembers,
    member,
    setAllMembers,
    setIsLoading,
    showToast,
}: handleDeleteMemberProps) => {
    try {
        setIsLoading(true)

        const response = await fetch(
            `${SERVER_ADDRESS}/api/members/${member.id}/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

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
