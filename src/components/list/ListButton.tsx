import { FetchLoading } from 'fetch-loading'
import type { ListButtonProps } from '../../types/types'

const ListButton = ({
    handleClick,
    index = 1,
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
                    type={isSubmit ? 'submit' : 'button'}
                    onClick={handleClick}
                    disabled={isDisabled || isLoading}
                    className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-32 w-full h-8 md:h-10 px-4 py-1 mx-auto`}
                    aria-label={`${label}${isDisabled || isLoading ? '. deaktiviert' : ''}`}
                >
                    {label}
                </button>
            )
        ) : type === 'regular' ? (
            isLoading ? (
                <div className="cursor-not-allowed h-7 md:h-8 rounded-lg outline-2 outline-zinc-500 xs:max-w-2/5 sm:max-w-60 md:max-w-72 w-full px-4 py-1 mx-auto flex justify-center items-center">
                    <FetchLoading theme="#71717b" />
                </div>
            ) : (
                <button
                    type={isSubmit ? 'submit' : 'button'}
                    onClick={handleClick}
                    disabled={isDisabled || isLoading}
                    className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} h-7 md:h-8 text-sm md:text-base rounded-lg outline-2 outline-zinc-500 xs:max-w-2/5 sm:max-w-60 md:max-w-72 w-full px-4 py-1 mx-auto`}
                    aria-label={`${label}${isDisabled || isLoading ? '. deaktiviert' : ''}`}
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
                type={isSubmit ? 'submit' : 'button'}
                onClick={handleClick}
                disabled={isDisabled || isLoading}
                className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} outline-2 outline-zinc-500 px-2 text-base md:text-lg h-8 md:h-10`}
                aria-label={`${label}${isDisabled || isLoading ? '. deaktiviert' : ''}`}
            >
                {label}
            </button>
        )

    return component
}

export default ListButton
