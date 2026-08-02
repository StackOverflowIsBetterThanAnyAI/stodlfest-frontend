import { FetchLoading } from 'fetch-loading'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { ChatMessageBotProps } from '../../types/types'

const ChatMessageBot = ({ index, message, status }: ChatMessageBotProps) => {
    return status === 'isLoading' ? (
        <li
            className="rounded-t-lg rounded-r-lg bg-zinc-200 max-w-32 w-full py-2 sn:py-3 flex justify-center items-center"
            aria-label="Dieter.ai denkt nach"
        >
            <FetchLoading theme="#372aac" />
        </li>
    ) : (
        <li
            className="whitespace-pre-wrap text-base md:text-lg rounded-t-lg rounded-r-lg bg-zinc-200 text-indigo-800 p-2 max-w-11/12 sm:max-w-4/5 w-fit"
            aria-label={`Dieter.ai ${index === 0 ? 'fragt' : 'antwortet'}:`}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    p: ({ children }) => <p>{children}</p>,
                }}
            >
                {message}
            </ReactMarkdown>
        </li>
    )
}

export default ChatMessageBot
