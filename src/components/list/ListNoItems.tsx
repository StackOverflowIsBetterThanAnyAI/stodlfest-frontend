type ListNoItemsProps = {
    label: string
}

const ListNoItems = ({ label }: ListNoItemsProps) => {
    return (
        <div className="flex mx-auto text-sm md:text-base text-center">
            {label}
        </div>
    )
}

export default ListNoItems
