import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
} from 'react'
import { LuBot } from 'react-icons/lu'
import ChatMessageList from './ChatMessageList'
import ListButton from '../list/ListButton'
import { handleBotResponse } from '../../api/handleBotResponse'
import { useToast } from '../../context/ToastContext'
import { useScreenWidth } from '../../hooks/useScreenWidth'
import type { chatHistoryType } from '../../types/types'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'

const Chatbot = () => {
    const parsedSessionData = getStoredSessionData()

    const SCREEN_WIDTH = useScreenWidth()
    const { showToast } = useToast()

    const [chatHistory, setChatHistory] = useState<chatHistoryType[]>(() => {
        const data = parsedSessionData?.chatHistory
        if (!data?.length) {
            return [{ role: 'bot', message: 'Hallo, wie kann ich Dir helfen?' }]
        }
        return data
    })
    const [question, setQuestion] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isChatVisible, setIsChatVisible] = useState<boolean>(() => {
        const data = parsedSessionData?.isChatVisible
        if (data && typeof data === 'boolean') {
            return data
        }
        setItemInSessionStorage('isChatVisible', false)
        return false
    })

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
        if (!trimmedQuestion?.length || isLoading) {
            return
        }
        const updatedChatHistory: chatHistoryType[] = [
            ...chatHistory,
            { role: 'user', message: trimmedQuestion },
        ]
        setChatHistory(updatedChatHistory)
        setItemInSessionStorage('chatHistory', updatedChatHistory)
        setQuestion('')
        triggerBotResponse(updatedChatHistory)
    }

    const triggerBotResponse = async (chatHistory: chatHistoryType[]) => {
        handleBotResponse({
            chatHistory,
            setChatHistory,
            setIsLoading,
            showToast,
        })
    }

    const handleOpenChatbot = () => {
        const updatedIsChatVisible = !isChatVisible
        setIsChatVisible(updatedIsChatVisible)
        setItemInSessionStorage('isChatVisible', updatedIsChatVisible)
    }

    useEffect(() => {
        if (!isChatVisible) {
            return
        }

        if (chatRef?.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                left: 0,
                behavior: 'smooth',
            })
        }

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        })
    }, [chatHistory, isChatVisible])

    return SCREEN_WIDTH === 'MOBILE' ? (
        <section className="flex flex-col w-full max-w-3xl outline-4 outline-zinc-200 rounded-lg bg-linear-to-b from-indigo-600 to-indigo-900">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold pb-4 border-b-2 border-zinc-200 bg-indigo-700 p-4">
                Chatte mit Dieter.ai
            </h2>
            {chatHistory?.length ? (
                <ChatMessageList
                    chatHistory={chatHistory}
                    chatRef={chatRef}
                    isLoading={isLoading}
                />
            ) : undefined}
            <form
                className="flex flex-col gap-y-2 gap-x-4 p-4 border-t-2 border-zinc-200 bg-indigo-800"
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
                    isLoading={false}
                    label="Abschicken"
                    type="form"
                    isDisabled={!question.trim()?.length}
                    isSubmit
                />
            </form>
        </section>
    ) : (
        <>
            {isChatVisible && (
                <section className="flex flex-col w-full max-w-3xl outline-4 outline-zinc-200 rounded-lg bg-linear-to-b from-indigo-600 to-indigo-900">
                    <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold pb-4 border-b-2 border-zinc-200 p-4">
                        Chatte mit Dieter.ai
                    </h2>
                    {chatHistory?.length ? (
                        <ChatMessageList
                            chatHistory={chatHistory}
                            chatRef={chatRef}
                            isLoading={isLoading}
                        />
                    ) : undefined}
                    <form
                        className="flex flex-col gap-y-2 gap-x-4 p-4 border-t-2 border-zinc-200 bg-indigo-800"
                        onSubmit={handleSubmitQuestion}
                    >
                        <label htmlFor="chatbotInput">
                            Stell mir eine Frage:
                        </label>
                        <textarea
                            id="chatbotInput"
                            className="resize-none text-sm md:text-base rounded-lg outline-2 outline-zinc-500 h-16 w-full px-2 py-1 mb-2"
                            onChange={handleChangeQuestion}
                            value={question}
                            onKeyDown={handleKeyDownQuestion}
                        />
                        <ListButton
                            handleClick={() => {}}
                            isLoading={false}
                            label="Abschicken"
                            type="form"
                            isDisabled={!question.trim()?.length}
                            isSubmit
                        />
                    </form>
                </section>
            )}
            <button
                onClick={handleOpenChatbot}
                className="fixed bottom-8 right-8 w-16 h-16 rounded-full focus-visible:rounded-full! flex items-center justify-center outline-2 outline-zinc-500 chatbot-button"
                title="Dieter.ai-Chatbot öffnen"
                aria-label="Dieter.ai-Chatbot öffnen"
            >
                <LuBot className="w-8 h-8" />
            </button>
        </>
    )
}

export default Chatbot
