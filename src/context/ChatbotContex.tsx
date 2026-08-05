import {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
    type ReactNode,
    type ChangeEvent,
    type KeyboardEvent,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IsLoggedInContext } from './IsLoggedInContext'
import { useToast } from './ToastContext'
import { handleBotResponse } from '../api/handleBotResponse'
import type { ChatHistoryType } from '../types/types'
import { getStoredSessionData } from '../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

interface ChatbotContextType {
    chatHistory: ChatHistoryType[]
    question: string
    isLoading: boolean
    isChatVisible: boolean
    chatRef: React.RefObject<HTMLUListElement | null>
    handleChangeQuestion: (e: ChangeEvent<HTMLTextAreaElement>) => void
    handleKeyDownQuestion: (e: KeyboardEvent<HTMLTextAreaElement>) => void
    handleSubmitQuestion: (e: React.FormEvent<HTMLFormElement>) => void
    handleOpenChatbot: () => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
    const parsedSessionData = getStoredSessionData()
    const location = useLocation()
    const navigate = useNavigate()
    const { showToast } = useToast()

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error(
            'ChatbotContext must be used within a IsLoggedInContext.Provider'
        )
    }
    const [_isLoggedIn, setIsLoggedIn] = isLoggedInContext

    const [accessToken, _setAccessToken] = useState<string>(() => {
        const data = parsedSessionData?.accessToken
        if (data?.length && typeof data === 'string') {
            return data
        }
        setItemInSessionStorage('accessToken', '')
        return ''
    })

    const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>(() => {
        const data = parsedSessionData?.chatHistory
        if (!data?.length) {
            const chat = [
                {
                    role: 'bot',
                    message: 'Hallo, wie kann ich dir beim Stodlfest helfen?',
                },
            ]
            setItemInSessionStorage('chatHistory', chat)
            return chat
        }
        return data
    })

    const [question, setQuestion] = useState<string>(() => {
        const data = parsedSessionData?.chatQuestion
        if (data?.length && typeof data === 'string') {
            return data
        }
        setItemInSessionStorage('chatQuestion', '')
        return ''
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isChatVisible, setIsChatVisible] = useState<boolean>(() => {
        const data = parsedSessionData?.isChatVisible
        if (data && typeof data === 'boolean') {
            return data
        }
        setItemInSessionStorage('isChatVisible', false)
        return false
    })

    const chatRef = useRef<HTMLUListElement>(null)

    const handleChangeQuestion = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(e.target.value)
        setItemInSessionStorage('chatQuestion', e.target.value)
    }

    const triggerBotResponse = useCallback(
        async (history: ChatHistoryType[]) => {
            handleBotResponse({
                accessToken,
                chatHistory: history,
                navigate,
                setChatHistory,
                setIsLoading,
                setIsLoggedIn,
                showToast,
            })
        },
        [accessToken, navigate, setIsLoggedIn, showToast]
    )

    const handleSubmitQuestion = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmedQuestion = question.trim()
        if (!trimmedQuestion?.length || isLoading) {
            return
        }
        const updatedChatHistory: ChatHistoryType[] = [
            ...chatHistory,
            { role: 'user', message: trimmedQuestion },
        ]
        setChatHistory(updatedChatHistory)
        setItemInSessionStorage('chatHistory', updatedChatHistory)
        setQuestion('')
        triggerBotResponse(updatedChatHistory)
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

    const handleOpenChatbot = () => {
        const updatedIsChatVisible = !isChatVisible
        setIsChatVisible(updatedIsChatVisible)
        setItemInSessionStorage('isChatVisible', updatedIsChatVisible)

        if (location.pathname === '/') {
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth',
                })
            })
        }
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
    }, [chatHistory, isChatVisible])

    return (
        <ChatbotContext.Provider
            value={{
                chatHistory,
                question,
                isLoading,
                isChatVisible,
                chatRef,
                handleChangeQuestion,
                handleKeyDownQuestion,
                handleSubmitQuestion,
                handleOpenChatbot,
            }}
        >
            {children}
        </ChatbotContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useChatbot = () => {
    const context = useContext(ChatbotContext)
    if (!context) {
        throw new Error('useChatbot must be used within a ChatbotProvider')
    }
    return context
}
