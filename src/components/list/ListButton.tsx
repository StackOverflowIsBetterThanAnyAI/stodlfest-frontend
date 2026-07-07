import type { ListButtonProps } from '../../types/types'

const ListButton = ({
    handleClick,
    index,
    isLoading,
    label,
    isSubmit = false,
}: ListButtonProps) => {
    return (
        <button
            type={isSubmit ? 'submit' : undefined}
            onClick={handleClick}
            disabled={isLoading}
            className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} h-6 md:h-8 text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto`}
        >
            {label}
        </button>
    )
}

export default ListButton
