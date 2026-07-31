import { memo } from 'react'
import type { ChatMessageListProps } from '../../types/types'
import ChatMessageBot from './ChatMessageBot'
import ChatMessageUser from './ChatMessageUser'

const ChatMessageList = memo(
    ({ chatHistory, chatRef }: ChatMessageListProps) => {
        return (
            <div
                className="flex flex-col gap-4 overflow-y-auto h-96 p-4 pt-2 scrollbar-thumb-zinc-200"
                ref={chatRef}
            >
                {chatHistory.map((chat, index) => {
                    return chat.role === 'bot' ? (
                        <ChatMessageBot message={chat.message} key={index} />
                    ) : (
                        <ChatMessageUser message={chat.message} key={index} />
                    )
                })}
            </div>
        )
    }
)

export default ChatMessageList
