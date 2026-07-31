import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
} from 'react'
import ChatMessageList from './ChatMessageList'
import ListButton from '../list/ListButton'
import { handleBotResponse } from '../../api/handleBotResponse'
import { useToast } from '../../context/ToastContext'
import type { chatHistoryType } from '../../types/types'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'

const Chatbot = () => {
    const parsedSessionData = getStoredSessionData()

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
                <ChatMessageList
                    chatHistory={chatHistory}
                    chatRef={chatRef}
                    isLoading={isLoading}
                />
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
                    isLoading={false}
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
