import { FetchLoading } from 'fetch-loading'
import type { ListButtonProps } from '../../types/types'

const ListButton = ({
    handleClick,
    index = 0,
    isDisabled = false,
    isLoading,
    label,
    type,
    isSubmit = false,
}: ListButtonProps) => {
    const component =
        type === 'refresh' ? (
            isLoading ? (
                <div className="cursor-not-allowed rounded-lg outline-2 outline-zinc-500 max-w-32 w-full h-8 md:h-10 px-4 py-1 mx-auto flex justify-center items-center">
                    <FetchLoading theme="#71717b" />
                </div>
            ) : (
                <button
                    type={isSubmit ? 'submit' : undefined}
                    onClick={handleClick}
                    disabled={isDisabled || isLoading}
                    className="primary-text-pseudo text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-32 w-full h-8 md:h-10 px-4 py-1 mx-auto"
                >
                    {label}
                </button>
            )
        ) : type === 'regular' ? (
            isLoading ? (
                <div className="cursor-not-allowed h-7 md:h-8 rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto flex justify-center items-center">
                    <FetchLoading theme="#71717b" />
                </div>
            ) : (
                <button
                    type={isSubmit ? 'submit' : undefined}
                    onClick={handleClick}
                    disabled={isDisabled || isLoading}
                    className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} h-7 md:h-8 text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto`}
                >
                    {label}
                </button>
            )
        ) : isLoading ? (
            <div className="cursor-not-allowed rounded-sm outline-2 outline-zinc-500 h-8 md:h-10 w-full flex justify-center items-center">
                <FetchLoading theme="#71717b" />
            </div>
        ) : (
            <button
                type={isSubmit ? 'submit' : undefined}
                onClick={handleClick}
                disabled={isDisabled || isLoading}
                className="primary-text-pseudo outline-2 outline-zinc-500 px-2 text-base md:text-lg h-8 md:h-10"
            >
                {label}
            </button>
        )

    return component
}

export default ListButton
