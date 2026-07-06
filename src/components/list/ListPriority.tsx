import type { ListPriorityType } from '../../types/types'

const ListPriorityItemFull = () => {
    return <span className="h-4 w-4 rounded-full bg-zinc-200"></span>
}

const ListPriorityItemEmpty = () => {
    return (
        <span className="h-4 w-4 rounded-full border-2 border-zinc-200"></span>
    )
}

const ListPriority = ({ priority }: ListPriorityType) => {
    return (
        <div
            className="flex gap-2"
            title={`Priorität: ${priority === 'low' ? 'Niedrig' : priority === 'middle' ? 'Mittel' : 'Hoch'}`}
        >
            <ListPriorityItemFull />
            {priority !== 'low' ? (
                <ListPriorityItemFull />
            ) : (
                <ListPriorityItemEmpty />
            )}
            {priority === 'high' ? (
                <ListPriorityItemFull />
            ) : (
                <ListPriorityItemEmpty />
            )}
        </div>
    )
}

export default ListPriority
