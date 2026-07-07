import { useContext, useState, type ChangeEvent } from 'react'
import ListPriority from './ListPriority'
import { SERVER_ADDRESS } from '../../constants/constants'
import { useToast } from '../../context/ToastContext'
import { UpcomingTasksContext } from '../../context/UpcomingTasksContext'
import { handleCompleteTask } from '../../api/handleCompleteTask'
import { handleDeleteCompletedTask } from '../../api/handleDeleteCompletedTask'
import type { ListTaskProps, TaskProps } from '../../types/types'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'

type ListTaskItemProps = {
    props: ListTaskProps
    task: TaskProps
    index: number
}

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

    const handleCancel = () => {
        setUpdatedDescription(task?.description || '')
        setUpdatedTask(task.task)
        setIsEdit(false)
    }
    const handleApplyUpdate = async () => {
        if (
            task.task === updatedTask &&
            task.description === updatedDescription
        ) {
            setIsEdit(false)
            return
        }

        try {
            const response = await fetch(
                `${SERVER_ADDRESS}/api/tasks/${task.id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        task: updatedTask,
                        description: updatedDescription,
                    }),
                }
            )

            if (!response.ok) {
                showToast({
                    isSuccess: false,
                    label: 'Aufgaben konnten nicht erledigt werden.',
                })
                return
            }

            const updatedTasks = upcomingTasks!.map((item: TaskProps) => {
                if (item.id === task.id) {
                    return {
                        ...item,
                        task: updatedTask,
                        description: updatedDescription,
                    }
                }
                return item
            })
            setUpcomingTasks(updatedTasks)
            setItemInSessionStorage('upcomingTasks', updatedTasks)
            setIsEdit(false)
        } catch {
            showToast({
                isSuccess: false,
                label: 'Beim Löschen dieser Aufgabe ist ein Fehler aufgetreten.',
            })
        }
    }

    const handleUpdateDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUpdatedDescription(e.target.value)
    }
    const handleUpdateTask = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdatedTask(e.target.value)
    }

    return (
        <div
            className={`py-2 px-3 flex flex-col gap-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm`}
        >
            <div className="flex flex-wrap gap-2 justify-between items-center">
                {isEdit ? (
                    <input
                        className="outline-2 outline-zinc-500 rounded-md px-2 text-base md:text-lg animate-pulse"
                        value={updatedTask}
                        onChange={handleUpdateTask}
                    />
                ) : (
                    <h3 className="text-base md:text-lg">{task.task}</h3>
                )}
                <ListPriority priority={task.priority} />
            </div>
            {isEdit ? (
                <textarea
                    className="resize-none outline-2 outline-zinc-500 rounded-md px-2 text-sm md:text-base line-clamp-3 break-words animate-pulse"
                    value={updatedDescription}
                    onChange={handleUpdateDescription}
                    placeholder="Beschreibung hinzufügen"
                    maxLength={255}
                />
            ) : task?.description?.length ? (
                <em className="text-sm md:text-base line-clamp-3 break-words">
                    {task.description}
                </em>
            ) : undefined}
            {isEdit ? (
                <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                    <button
                        onClick={handleApplyUpdate}
                        className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto`}
                    >
                        Anwenden
                    </button>
                    <button
                        onClick={handleCancel}
                        className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto`}
                    >
                        Abbrechen
                    </button>
                </div>
            ) : (
                <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                    {props.allowDelete ? (
                        <button
                            onClick={() =>
                                handleDeleteCompletedTask({
                                    setCompletedTasks: props.setCompletedTasks,
                                    showToast: props.showToast,
                                    task,
                                    completedTasks: props.completedTasks,
                                })
                            }
                            className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto`}
                        >
                            Löschen
                        </button>
                    ) : undefined}
                    {props.allowEdit ? (
                        <button
                            onClick={() => setIsEdit(true)}
                            className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto`}
                        >
                            Bearbeiten
                        </button>
                    ) : undefined}
                    {props.allowComplete ? (
                        <button
                            onClick={() =>
                                handleCompleteTask({
                                    setCompletedTasks: props.setCompletedTasks,
                                    setUpcomingTasks: props.setUpcomingTasks,
                                    showToast: props.showToast,
                                    task,
                                    completedTasks: props.completedTasks,
                                    upcomingTasks: props.upcomingTasks,
                                })
                            }
                            className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} text-sm md:text-base rounded-lg outline-2 outline-zinc-500 max-w-72 w-full px-4 py-1 mx-auto`}
                        >
                            Erledigt
                        </button>
                    ) : undefined}
                </div>
            )}
        </div>
    )
}

export default ListTaskItem
