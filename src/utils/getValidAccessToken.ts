import { jwtDecode } from 'jwt-decode'
import { handleRefreshAccessToken } from '../api/handleRefreshAccessToken'
import type { getValidAccessTokenProps } from '../types/types'

export const getValidAccessToken = async ({
    accessToken,
    refreshToken,
}: getValidAccessTokenProps) => {
    if (!accessToken?.length) {
        return ''
    }
    try {
        const decoded = jwtDecode(accessToken)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000
        const bufferInSeconds = 60

        if (tokenExpiration && tokenExpiration - bufferInSeconds < now) {
            return await handleRefreshAccessToken({ refreshToken })
        }
        return accessToken
    } catch {
        return ''
    }
}
