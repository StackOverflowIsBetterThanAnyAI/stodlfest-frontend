import { SERVER_ADDRESS } from '../constants/constants'
import type { handleAddNewMemberProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleAddNewMember = async ({
    e,
    age,
    name,
    setAge,
    setAllMembers,
    setIsLoading,
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
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            const error = errorData.task.join(' ')
            showToast({
                label: error,
            })
            return
        }

        setName('')
        setSurname('')
        setAge('underage')
        setIsSubmitDisabled(true)
        setItemInSessionStorage('nameAdd', '')
        setItemInSessionStorage('surnameAdd', '')
        setItemInSessionStorage('ageAdd', 'underage')

        const newMember = await response.json()
        setAllMembers((prevMembers) => {
            const updatedMembers = [newMember, ...(prevMembers || [])]
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
