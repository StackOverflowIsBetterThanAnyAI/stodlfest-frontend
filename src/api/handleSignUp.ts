import { SERVER_ADDRESS } from '../constants/constants'
import type { handleSignUpProps, TokenProps } from '../types/types'
import { setItemInLocalStorage } from '../utils/setItemInLocalStorage'

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
            setItemInLocalStorage('isLoggedIn', false)
            return
        }

        const token: TokenProps = await response.json()
        const { access, refresh } = token

        setItemInLocalStorage('accessToken', access)
        setItemInLocalStorage('refreshToken', refresh)
        setIsLoggedIn(true)
        setItemInLocalStorage('isLoggedIn', true)
    } catch {
        showToast({
            label: 'Beim Erstellen dieses Accounts ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
        setIsSubmitDisabled(false)
    }
}
