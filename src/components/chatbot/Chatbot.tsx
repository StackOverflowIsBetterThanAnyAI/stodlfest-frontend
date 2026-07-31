import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
} from 'react'
import { GoogleGenAI } from '@google/genai'
import ChatMessageBot from './ChatMessageBot'
import ChatMessageUser from './ChatMessageUser'
import ListButton from '../list/ListButton'
import type { chatHistoryType } from '../../types/types'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
})

const Chatbot = () => {
    const parsedSessionData = getStoredSessionData()

    const [chatHistory, setChatHistory] = useState<chatHistoryType[]>(() => {
        const data = parsedSessionData?.chatHistory
        if (!data?.length) {
            return [{ role: 'bot', message: 'Hallo, wie kann ich Dir helfen?' }]
        }
        return data
    })
    const [question, setQuestion] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const chatRef = useRef<HTMLDivElement>(null)

    const handleChangeQuestion = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(e.target.value)
    }

    const handleKeyDownQuestion = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key !== 'Enter') {
            return
        }
        if (!e.shiftKey) {
            e.preventDefault()
            handleSubmitQuestion(
                e as unknown as React.FocusEvent<HTMLFormElement>
            )
        }
    }

    const handleSubmitQuestion = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmedQuestion = question.trim()
        if (!trimmedQuestion?.length) {
            return
        }
        const updatedChatHistory: chatHistoryType[] = [
            ...chatHistory,
            { role: 'user', message: trimmedQuestion },
            { role: 'bot', message: 'Denkt nach ...' },
        ]
        setChatHistory(updatedChatHistory)
        setItemInSessionStorage('chatHistory', updatedChatHistory)
        setQuestion('')
        triggerBotResponse(updatedChatHistory)
    }

    const triggerBotResponse = async (history: chatHistoryType[]) => {
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
                ...history.filter(
                    (_item, index) => index !== history.length - 1
                ),
                {
                    role: 'bot',
                    message:
                        interaction.output_text ||
                        'Fehler beim Abrufen der Antwort. Bitte versuche es erneut.',
                },
            ]
            setChatHistory(updatedChatHistory)
            setItemInSessionStorage('chatHistory', updatedChatHistory)
        } catch (error) {
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

    useEffect(() => {
        if (chatRef?.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                left: 0,
                behavior: 'smooth',
            })
        }
    }, [chatHistory])

    return (
        <section className="flex flex-col gap-2 w-full max-w-3xl outline-4 outline-zinc-200 rounded-lg bg-linear-to-b from-indigo-700 to-indigo-800">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold pb-4 border-b-2 border-zinc-200 bg-indigo-700 p-4">
                Chatte mit dem Stodlfest-Bot
            </h2>
            {chatHistory?.length ? (
                <div
                    className="flex flex-col gap-4 overflow-y-auto h-96 p-4 pt-2 scrollbar-thumb-zinc-200"
                    ref={chatRef}
                >
                    {chatHistory.map((chat, index) => {
                        return chat.role === 'bot' ? (
                            <ChatMessageBot
                                message={chat.message}
                                key={index}
                            />
                        ) : (
                            <ChatMessageUser
                                message={chat.message}
                                key={index}
                            />
                        )
                    })}
                </div>
            ) : undefined}
            <form
                className="flex flex-col gap-y-2 gap-x-4 p-4"
                onSubmit={handleSubmitQuestion}
            >
                <label htmlFor="chatbotInput">Stell mir eine Frage:</label>
                <textarea
                    id="chatbotInput"
                    className="resize-none text-sm md:text-base rounded-lg outline-2 outline-zinc-500 h-16 w-full px-2 py-1 mb-2"
                    onChange={handleChangeQuestion}
                    value={question}
                    onKeyDown={handleKeyDownQuestion}
                />
                <ListButton
                    handleClick={() => {}}
                    isLoading={isLoading}
                    label="Abschicken"
                    type="form"
                    isDisabled={!question.trim()?.length}
                    isSubmit
                />
            </form>
        </section>
    )
}

export default Chatbot
