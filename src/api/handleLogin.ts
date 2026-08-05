import { SERVER_ADDRESS } from '../constants/constants'
import type { handleLoginProps, TokenProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

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
            setItemInSessionStorage('isLoggedIn', false)
            return
        }

        const token: TokenProps = await response.json()
        const { access, refresh } = token

        setItemInSessionStorage('accessToken', access)
        setItemInSessionStorage('refreshToken', refresh)
        setIsLoggedIn(true)
        setItemInSessionStorage('isLoggedIn', true)
    } catch {
        showToast({
            label: 'Beim Anmelden ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
        setIsSubmitDisabled(false)
    }
}
