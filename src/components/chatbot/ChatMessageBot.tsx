import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { ChatMessageProps } from '../../types/types'

const ChatMessageBot = ({ message }: ChatMessageProps) => {
    return (
        <div className="whitespace-pre-wrap text-base md:text-lg rounded-t-lg rounded-r-lg bg-zinc-200 text-indigo-800 p-2 max-w-11/12 sm:max-w-4/5 w-fit">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {message}
            </ReactMarkdown>
        </div>
    )
}

export default ChatMessageBot
