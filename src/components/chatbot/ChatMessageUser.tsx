import type { ChatMessageUserProps } from '../../types/types'

const ChatMessageUser = ({ message }: ChatMessageUserProps) => {
    return (
        <li
            className="whitespace-pre-wrap text-base md:text-lg rounded-t-lg rounded-l-lg bg-indigo-700 border-2 border-zinc-200 p-2 max-w-11/12 sm:max-w-4/5 w-fit self-end"
            aria-label={`Du fragst: ${message}`}
        >
            {message}
        </li>
    )
}

export default ChatMessageUser
