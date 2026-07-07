import { useContext, useState, type ChangeEvent } from 'react'
import ListButton from './ListButton'
import ListPriority from './ListPriority'
import { useToast } from '../../context/ToastContext'
import { UpcomingTasksContext } from '../../context/UpcomingTasksContext'
import { handleCompleteTask } from '../../api/handleCompleteTask'
import { handleDeleteCompletedTask } from '../../api/handleDeleteCompletedTask'
import { handleApplyUpdate } from '../../api/handleUpdateTask'
import type { ListTaskItemProps } from '../../types/types'

const ListTaskItem = ({ props, task, index }: ListTaskItemProps) => {
    const { showToast } = useToast()

    const upcomingTasksContext = useContext(UpcomingTasksContext)
    if (!upcomingTasksContext) {
        throw new Error(
            'ListTaskItem must be used within a UpcomingTasksContext.Provider'
        )
    }
    const [upcomingTasks, setUpcomingTasks] = upcomingTasksContext

    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [updatedDescription, setUpdatedDescription] = useState<string>(
        task?.description || ''
    )
    const [updatedTask, setUpdatedTask] = useState<string>(task.task)

    const applyUpdate = async () => {
        handleApplyUpdate({
            setIsEdit,
            setUpcomingTasks,
            showToast,
            task,
            upcomingTasks,
            updatedDescription,
            updatedTask,
        })
    }

    const handleCancel = () => {
        setUpdatedDescription(task?.description || '')
        setUpdatedTask(task.task)
        setIsEdit(false)
    }
    const handleUpdateDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUpdatedDescription(e.target.value)
    }
    const handleUpdateTask = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdatedTask(e.target.value)
    }

    return isEdit ? (
        <form
            className={`py-2 px-3 flex flex-col gap-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm`}
            onSubmit={applyUpdate}
        >
            <div className="flex flex-wrap gap-2 justify-between items-center">
                <input
                    className="outline-2 outline-zinc-500 rounded-md px-2 text-base md:text-lg animate-pulse"
                    value={updatedTask}
                    onChange={handleUpdateTask}
                />
                <ListPriority priority={task.priority} />
            </div>
            <textarea
                className="resize-none outline-2 outline-zinc-500 rounded-md px-2 text-sm md:text-base line-clamp-3 break-words animate-pulse"
                value={updatedDescription}
                onChange={handleUpdateDescription}
                placeholder="Beschreibung hinzufügen"
                maxLength={255}
            />
            <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                <ListButton
                    handleClick={applyUpdate}
                    index={index}
                    label="Anwenden"
                />
                <ListButton
                    handleClick={handleCancel}
                    index={index}
                    label="Abbrechen"
                />
            </div>
        </form>
    ) : (
        <div
            className={`py-2 px-3 flex flex-col gap-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm`}
        >
            <div className="flex flex-wrap gap-2 justify-between items-center">
                <h3 className="text-base md:text-lg">{task.task}</h3>
                <ListPriority priority={task.priority} />
            </div>
            {task?.description?.length ? (
                <em className="text-sm md:text-base line-clamp-3 break-words">
                    {task.description}
                </em>
            ) : undefined}
            <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                {props.allowDelete ? (
                    <ListButton
                        handleClick={() =>
                            handleDeleteCompletedTask({
                                setCompletedTasks: props.setCompletedTasks,
                                showToast: props.showToast,
                                task,
                                completedTasks: props.completedTasks,
                            })
                        }
                        index={index}
                        label="Löschen"
                    />
                ) : undefined}
                {props.allowEdit ? (
                    <ListButton
                        handleClick={() => setIsEdit(true)}
                        index={index}
                        label="Bearbeiten"
                    />
                ) : undefined}
                {props.allowComplete ? (
                    <ListButton
                        handleClick={() =>
                            handleCompleteTask({
                                setCompletedTasks: props.setCompletedTasks,
                                setUpcomingTasks: props.setUpcomingTasks,
                                showToast: props.showToast,
                                task,
                                completedTasks: props.completedTasks,
                                upcomingTasks: props.upcomingTasks,
                            })
                        }
                        index={index}
                        label="Erledigt"
                    />
                ) : undefined}
            </div>
        </div>
    )
}

export default ListTaskItem
