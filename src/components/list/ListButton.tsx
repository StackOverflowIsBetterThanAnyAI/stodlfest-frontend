type ListButtonProps = {
    handleClick: () => void
    index: number
    label: string
}

const ListButton = ({ handleClick, index, label }: ListButtonProps) => {
    return (
        <button
            onClick={handleClick}
            className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto`}
        >
            {label}
        </button>
    )
}

export default ListButton
