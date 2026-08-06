import { SERVER_ADDRESS } from '../constants/constants'
import type { handleRefreshAccessTokenProps, TokenProps } from '../types/types'
import { setItemInLocalStorage } from '../utils/setItemInLocalStorage'

export const handleRefreshAccessToken = async ({
    refreshToken,
}: handleRefreshAccessTokenProps) => {
    try {
        const res = await fetch(`${SERVER_ADDRESS}/api/v1/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        })
        if (res.status === 200) {
            const data: TokenProps = await res.json()
            setItemInLocalStorage('accessToken', data.access)
            return data.access
        } else {
            return ''
        }
    } catch {
        return ''
    }
}
