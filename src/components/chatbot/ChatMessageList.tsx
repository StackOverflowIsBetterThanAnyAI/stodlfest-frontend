import { memo } from 'react'
import type { ChatMessageListProps } from '../../types/types'
import ChatMessageBot from './ChatMessageBot'
import ChatMessageUser from './ChatMessageUser'

const ChatMessageList = memo(
    ({ chatHistory, chatRef, isLoading }: ChatMessageListProps) => {
        return (
            <ul
                className="flex flex-col gap-4 overflow-y-auto h-96 p-4 pt-2 scrollbar-thumb-zinc-200"
                aria-label="Chatverlauf mit Dieter.ai"
                ref={chatRef}
            >
                {chatHistory.map((chat, index) => {
                    return chat.role === 'bot' ? (
                        <ChatMessageBot
                            index={index}
                            message={chat.message}
                            status={null}
                            key={index}
                        />
                    ) : (
                        <ChatMessageUser message={chat.message} key={index} />
                    )
                })}
                {isLoading ? (
                    <ChatMessageBot
                        index={chatHistory.length}
                        message=""
                        status="isLoading"
                    />
                ) : undefined}
            </ul>
        )
    }
)

export default ChatMessageList
