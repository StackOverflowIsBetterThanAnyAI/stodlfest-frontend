import { handleCompleteTask } from '../../api/handleCompleteTask'
import { handleDeleteCompletedTask } from '../../api/handleDeleteCompletedTask'
import type { TaskProps, ToastProps } from '../../types/types'

type BaseListTaskProps = {
    tasks: TaskProps[]
}

type DeleteProps =
    | {
          allowDelete: true
          setCompletedTasks: React.Dispatch<
              React.SetStateAction<TaskProps[] | []>
          >
          showToast: (props: ToastProps) => void
          completedTasks: TaskProps[]
      }
    | {
          allowDelete?: false
      }

type CompleteProps =
    | {
          allowComplete: true
          setCompletedTasks: React.Dispatch<
              React.SetStateAction<TaskProps[] | []>
          >
          setUpcomingTasks: React.Dispatch<
              React.SetStateAction<TaskProps[] | []>
          >
          completedTasks: TaskProps[]
          upcomingTasks: TaskProps[]
          showToast: (props: ToastProps) => void
      }
    | {
          allowComplete?: false
      }

type EditProps =
    | {
          allowEdit: true
      }
    | {
          allowEdit?: false
      }

export type ListTaskProps = BaseListTaskProps &
    DeleteProps &
    CompleteProps &
    EditProps

const ListTask = (props: ListTaskProps) => {
    return (
        <ul className="flex flex-col gap-4 mx-2">
            {props.tasks.map((task: TaskProps, id: number) => (
                <li
                    key={task.id}
                    className={`flex flex-col ${id < props.tasks.length - 1 ? 'pb-4 border-b-2' : ''} border-zinc-200`}
                >
                    <div
                        className={`py-2 px-3 flex flex-col gap-2 ${id % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm`}
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-base md:text-lg">
                                {task.task}
                            </h3>
                            <span className="text-sm md:text-base">
                                {task.priority}
                            </span>
                        </div>
                        {task?.description?.length ? (
                            <em className="text-sm md:text-base line-clamp-3 break-words">
                                {task.description}
                            </em>
                        ) : undefined}
                        <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                            {props.allowDelete ? (
                                <button
                                    onClick={() =>
                                        handleDeleteCompletedTask({
                                            setCompletedTasks:
                                                props.setCompletedTasks,
                                            showToast: props.showToast,
                                            task,
                                            completedTasks:
                                                props.completedTasks,
                                        })
                                    }
                                    className="secondary-text-pseudo text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto"
                                >
                                    Löschen
                                </button>
                            ) : undefined}
                            {props.allowEdit ? (
                                <button
                                    onClick={() => console.log('todo')}
                                    className="secondary-text-pseudo text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto"
                                >
                                    Bearbeiten
                                </button>
                            ) : undefined}
                            {props.allowComplete ? (
                                <button
                                    onClick={() =>
                                        handleCompleteTask({
                                            setCompletedTasks:
                                                props.setCompletedTasks,
                                            setUpcomingTasks:
                                                props.setUpcomingTasks,
                                            showToast: props.showToast,
                                            task,
                                            completedTasks:
                                                props.completedTasks,
                                            upcomingTasks: props.upcomingTasks,
                                        })
                                    }
                                    className="secondary-text-pseudo text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto"
                                >
                                    Erledigt
                                </button>
                            ) : undefined}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default ListTask
