import type { chatHistoryType, handleBotResponseProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleBotResponse = async ({
    ai,
    chatHistory,
    history,
    setChatHistory,
    setIsLoading,
    question,
}: handleBotResponseProps) => {
    setIsLoading(true)
    try {
        const interaction = await ai.interactions.create({
            model: 'gemini-3.5-flash-lite',
            input: question,
            system_instruction:
                'Please only answer in German. Keep yourself as short as possible.',
            generation_config: {
                thinking_level: 'low',
            },
        })

        const updatedChatHistory: chatHistoryType[] = [
            ...history.filter((_item, index) => index !== history.length - 1),
            {
                role: 'bot',
                message:
                    interaction.output_text ||
                    'Fehler beim Abrufen der Antwort. Bitte versuche es erneut.',
            },
        ]
        setChatHistory(updatedChatHistory)
        setItemInSessionStorage('chatHistory', updatedChatHistory)
    } catch (_error) {
        const updatedChatHistory: chatHistoryType[] = [
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
