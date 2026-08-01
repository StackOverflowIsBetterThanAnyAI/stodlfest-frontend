import { FetchLoading } from 'fetch-loading'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { ChatMessageBotProps } from '../../types/types'

const ChatMessageBot = ({ index, message, status }: ChatMessageBotProps) => {
    return status === 'isLoading' ? (
        <div className="rounded-t-lg rounded-r-lg bg-zinc-200 max-w-32 w-full py-2 sn:py-3 flex justify-center items-center">
            <FetchLoading theme="#372aac" />
        </div>
    ) : (
        <div className="whitespace-pre-wrap text-base md:text-lg rounded-t-lg rounded-r-lg bg-zinc-200 text-indigo-800 p-2 max-w-11/12 sm:max-w-4/5 w-fit">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    p: ({ children }) => (
                        <p
                            aria-label={`Dieter.ai ${index === 0 ? 'fragt' : 'antwortet'}: ${message}`}
                        >
                            {children}
                        </p>
                    ),
                }}
            >
                {message}
            </ReactMarkdown>
        </div>
    )
}

export default ChatMessageBot
