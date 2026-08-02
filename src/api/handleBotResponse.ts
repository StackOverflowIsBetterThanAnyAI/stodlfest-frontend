import { SERVER_ADDRESS } from '../constants/constants'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'
import type { ChatHistoryType, handleBotResponseProps } from '../types/types'

export const handleBotResponse = async ({
    chatHistory,
    setChatHistory,
    setIsLoading,
    showToast,
}: handleBotResponseProps) => {
    setIsLoading(true)
    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatHistory),
        })

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
    } catch (_error) {
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
