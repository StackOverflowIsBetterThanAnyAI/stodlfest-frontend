import type { ListButtonProps } from '../../types/types'

const ListButton = ({
    handleClick,
    index,
    label,
    isSubmit = false,
}: ListButtonProps) => {
    return (
        <button
            type={isSubmit ? 'submit' : undefined}
            onClick={handleClick}
            className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto`}
        >
            {label}
        </button>
    )
}

export default ListButton
