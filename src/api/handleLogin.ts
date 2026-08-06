import { SERVER_ADDRESS } from '../constants/constants'
import type { handleLoginProps, TokenProps } from '../types/types'
import { setItemInLocalStorage } from '../utils/setItemInLocalStorage'

export const handleLogin = async ({
    password,
    setIsLoading,
    setIsLoggedIn,
    setIsSubmitDisabled,
    showToast,
    userName,
}: handleLoginProps) => {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/auth/token/`, {
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
            showToast({
                label: 'Nutzer konnte nicht angemeldet werden',
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
            label: 'Beim Anmelden ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
        setIsSubmitDisabled(false)
    }
}
