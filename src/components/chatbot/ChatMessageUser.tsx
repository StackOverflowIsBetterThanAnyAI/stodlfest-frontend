import type { ChatMessageProps } from '../../types/types'

const ChatMessageUser = ({ message }: ChatMessageProps) => {
    return (
        <div className="whitespace-pre-wrap text-base md:text-lg rounded-t-lg rounded-l-lg bg-indigo-700 border-2 border-zinc-200 p-2 w-fit self-end">
            {message}
        </div>
    )
}

export default ChatMessageUser
