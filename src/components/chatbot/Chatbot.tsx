import { useEffect } from 'react'
import { LuBot } from 'react-icons/lu'
import ChatMessageList from './ChatMessageList'
import ListButton from '../list/ListButton'
import { useChatbot } from '../../context/ChatbotContex'
import { useScreenWidth } from '../../hooks/useScreenWidth'

const Chatbot = () => {
    const SCREEN_WIDTH = useScreenWidth()
    const {
        chatHistory,
        question,
        isLoading,
        chatRef,
        handleChangeQuestion,
        handleKeyDownQuestion,
        handleSubmitQuestion,
    } = useChatbot()

    useEffect(() => {
        if (chatRef?.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                left: 0,
                behavior: 'smooth',
            })
        }
    }, [chatHistory, chatRef])

    return SCREEN_WIDTH === 'MOBILE' ? (
        <section className="flex flex-col w-full max-w-3xl outline-4 outline-zinc-200 rounded-lg bg-linear-to-b from-indigo-600 to-indigo-900">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold pb-4 border-b-2 border-zinc-200 bg-indigo-700 p-4 flex justify-between">
                Chatte mit Dieter.ai
                <LuBot className="w-6 h-6" />
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
        <section className="flex flex-col w-full max-w-3xl outline-4 outline-zinc-200 rounded-lg bg-linear-to-b from-indigo-600 to-indigo-900">
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
