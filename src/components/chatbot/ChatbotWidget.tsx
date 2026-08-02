import { LuBot } from 'react-icons/lu'
import { useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import ChatMessageList from './ChatMessageList'
import ListButton from '../list/ListButton'
import { useChatbot } from '../../context/ChatbotContex'

const ChatbotWidget = () => {
    const location = useLocation()
    const {
        chatHistory,
        question,
        isLoading,
        isChatVisible,
        chatRef,
        handleChangeQuestion,
        handleKeyDownQuestion,
        handleSubmitQuestion,
        handleOpenChatbot,
    } = useChatbot()

    const widgetWindowRef = useRef<HTMLElement>(null)
    const toggleButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (!isChatVisible) {
            return
        }

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement

            const isNavLink = Boolean(
                target.closest('a') && target.closest('nav')
            )

            if (isNavLink) {
                return
            }

            if (
                widgetWindowRef.current &&
                !widgetWindowRef.current.contains(target) &&
                toggleButtonRef.current &&
                !toggleButtonRef.current.contains(target)
            ) {
                handleOpenChatbot()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isChatVisible, handleOpenChatbot])

    useEffect(() => {
        if (!isChatVisible) {
            return
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleOpenChatbot()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isChatVisible, handleOpenChatbot])

    if (location.pathname === '/') {
        return null
    }

    return (
        <div className="fixed left-6 bottom-6 lg:bottom-8 right-6 lg:right-8 text-zinc-100 z-50 flex flex-col items-end gap-y-4">
            {isChatVisible && (
                <section
                    className="flex flex-col w-auto xs:w-sm sm:w-md md:w-xl lg:w-2xl outline-4 outline-zinc-200 rounded-lg bg-linear-to-b from-indigo-600 to-indigo-900"
                    ref={widgetWindowRef}
                >
                    <h2 className="text-2xl md:text-3xl font-bold pb-4 border-b-2 border-zinc-200 bg-indigo-700 p-4 flex justify-between">
                        Chatte mit Dieter.ai
                        <LuBot className="w-8 md:w-10 h-8 md:h-10" />
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
                        <label htmlFor="chatbotWidgetInput">
                            Stell mir eine Frage:
                        </label>
                        <textarea
                            id="chatbotWidgetInput"
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
                className="w-16 h-16 rounded-full flex items-center justify-center outline-2 outline-zinc-500 chatbot-button"
                title={`Dieter.ai-Chatbot ${isChatVisible ? 'schließen' : 'öffnen'}`}
                aria-label={`Dieter.ai-Chatbot ${isChatVisible ? 'schließen' : 'öffnen'}`}
                ref={toggleButtonRef}
            >
                <LuBot className="w-8 h-8" />
            </button>
        </div>
    )
}

export default ChatbotWidget
