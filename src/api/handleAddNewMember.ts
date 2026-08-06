import { SERVER_ADDRESS } from '../constants/constants'
import type { handleAddNewMemberProps, MemberProps } from '../types/types'
import { getValidAccessToken } from '../utils/getValidAccessToken'
import { setItemInLocalStorage } from '../utils/setItemInLocalStorage'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleAddNewMember = async ({
    accessToken,
    e,
    age,
    name,
    navigate,
    refreshToken,
    setAge,
    setAllMembers,
    setIsLoading,
    setIsLoggedIn,
    setIsSubmitDisabled,
    setName,
    setSurname,
    showToast,
    surname,
}: handleAddNewMemberProps) => {
    e.preventDefault()

    const memberData = {
        name,
        surname,
        age,
    }

    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/members/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${await getValidAccessToken({ accessToken, refreshToken })}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData),
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
            const errorData = await response.json()
            const error = errorData.non_field_errors.join(' ')
            showToast({
                label: error,
            })
            return
        }

        setName('')
        setSurname('')
        setAge('ofLegalAge')
        setIsSubmitDisabled(true)
        setItemInSessionStorage('nameAdd', '')
        setItemInSessionStorage('surnameAdd', '')
        setItemInSessionStorage('ageAdd', 'ofLegalAge')

        const newMember: MemberProps = await response.json()
        setAllMembers((prevMembers) => {
            const updatedMembers = [newMember, ...(prevMembers || [])]
            updatedMembers.sort((a, b) => {
                const surnameCompare = a.surname.localeCompare(b.surname, 'de')
                if (!surnameCompare) {
                    return a.name.localeCompare(b.name, 'de')
                }
                return surnameCompare
            })
            setItemInSessionStorage('allMembers', updatedMembers)
            return updatedMembers
        })
    } catch {
        showToast({
            label: 'Beim Hinzufügen dieses Mitglieds ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
