import ListTaskItem from './ListTaskItem'
import type { ListTaskProps, TaskProps } from '../../types/types'

const ListTask = (props: ListTaskProps) => {
    return (
        <ul className="flex flex-col gap-4 mx-2">
            {props.tasks.map((task: TaskProps, index: number) => (
                <li
                    key={task.id}
                    className={`flex flex-col ${index < props.tasks.length - 1 ? 'pb-4 border-b-2' : ''} border-zinc-200`}
                >
                    <ListTaskItem
                        index={index}
                        props={props}
                        task={task}
                        key={task.id}
                    />
                </li>
            ))}
        </ul>
    )
}

export default ListTask
