import { SERVER_ADDRESS } from '../constants/constants'
import type { handleSignUpProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleSignUp = async ({
    password,
    setIsLoading,
    setIsLoggedIn,
    setIsSubmitDisabled,
    showToast,
    userName,
}: handleSignUpProps) => {
    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userName,
                password,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            const error = errorData.username.join(' ')
            showToast({
                label: error,
            })
            setIsLoggedIn(false)
            setItemInSessionStorage('isLoggedIn', false)
            return
        }

        setIsLoggedIn(true)
        setItemInSessionStorage('isLoggedIn', true)
    } catch {
        showToast({
            label: 'Beim Erstellen dieses Accounts ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
        setIsSubmitDisabled(false)
    }
}
