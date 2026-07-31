import type { ChatMessageProps } from '../../types/types'

const ChatMessageBot = ({ message }: ChatMessageProps) => {
    return (
        <div className="whitespace-pre-wrap text-base md:text-lg rounded-t-lg rounded-r-lg bg-zinc-200 text-indigo-800 p-2 max-w-11/12 sm:max-w-4/5 w-fit">
            {message}
        </div>
    )
}

export default ChatMessageBot
