import { SERVER_ADDRESS } from '../constants/constants'
import type { ChatHistoryType, handleBotResponseProps } from '../types/types'
import { getValidAccessToken } from '../utils/getValidAccessToken'
import { setItemInLocalStorage } from '../utils/setItemInLocalStorage'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleBotResponse = async ({
    accessToken,
    chatHistory,
    navigate,
    refreshToken,
    setChatHistory,
    setIsLoading,
    setIsLoggedIn,
    showToast,
}: handleBotResponseProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/chat/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${await getValidAccessToken({ accessToken, refreshToken })}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatHistory),
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
            showToast({
                label: 'Fehler beim Abrufen der Antwort. Bitte versuche es erneut.',
            })
            return
        }

        const data = await response.json()

        const updatedChatHistory: ChatHistoryType[] = [
            ...chatHistory,
            {
                role: 'bot',
                message:
                    data.output_text ||
                    'Fehler beim Abrufen der Antwort. Bitte versuche es erneut.',
            },
        ]
        setChatHistory(updatedChatHistory)
        setItemInSessionStorage('chatHistory', updatedChatHistory)
    } catch {
        const updatedChatHistory: ChatHistoryType[] = [
            ...chatHistory,
            {
                role: 'bot',
                message:
                    'Fehler beim Abrufen der Antwort. Bitte versuche es erneut.',
            },
        ]
        setChatHistory(updatedChatHistory)
        setItemInSessionStorage('chatHistory', updatedChatHistory)
    } finally {
        setIsLoading(false)
    }
}
