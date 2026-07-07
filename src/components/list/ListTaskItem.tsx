import { useContext, useState, type ChangeEvent } from 'react'
import ListButton from './ListButton'
import ListPriority from './ListPriority'
import FormRadioButton from '../form/FormRadioButton'
import { useToast } from '../../context/ToastContext'
import { UpcomingTasksContext } from '../../context/UpcomingTasksContext'
import { handleCompleteTask } from '../../api/handleCompleteTask'
import { handleDeleteCompletedTask } from '../../api/handleDeleteCompletedTask'
import { handleApplyUpdate } from '../../api/handleApplyUpdate'
import type { ListTaskItemProps, PriorityType } from '../../types/types'

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
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [updatedDescription, setUpdatedDescription] = useState<string>(
        task?.description || ''
    )
    const [updatedPriority, setUpdatedPriority] = useState<PriorityType>(
        task.priority
    )
    const [updatedTask, setUpdatedTask] = useState<string>(task.task)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleApplyUpdate({
            setIsEdit,
            setIsLoading,
            setUpcomingTasks,
            showToast,
            task,
            upcomingTasks,
            updatedDescription,
            updatedPriority,
            updatedTask,
        })
    }
    const applyUpdate = async () => {
        handleApplyUpdate({
            setIsEdit,
            setIsLoading,
            setUpcomingTasks,
            showToast,
            task,
            upcomingTasks,
            updatedDescription,
            updatedPriority,
            updatedTask,
        })
    }

    const handleEscape = (
        e:
            | React.KeyboardEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.key === 'Escape') {
            handleCancel()
        }
    }
    const handleCancel = () => {
        setUpdatedDescription(task?.description || '')
        setUpdatedTask(task.task)
        setIsEdit(false)
    }
    const handleUpdateDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUpdatedDescription(e.target.value)
    }
    const handleUpdatePriority = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdatedPriority(e.target.value as PriorityType)
    }
    const handleUpdateTask = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdatedTask(e.target.value)
    }

    return isEdit ? (
        <form
            className={`py-2 px-3 flex flex-col gap-x-4 gap-y-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm outline-2 outline-zinc-500`}
            onSubmit={handleSubmit}
        >
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-between items-center">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <label
                        htmlFor="taskUpdate"
                        className="font-bold text-base md:text-lg"
                    >
                        Aufgabe:
                    </label>
                    <input
                        type="text"
                        className="min-w-32 w-full outline-2 outline-zinc-500 rounded-md px-2 text-base md:text-lg"
                        value={updatedTask}
                        id="taskUpdate"
                        onChange={handleUpdateTask}
                        onKeyDown={handleEscape}
                        maxLength={127}
                        required
                    />
                </div>
                <fieldset>
                    <legend className="font-bold text-base md:text-lg">
                        Priorität:
                    </legend>
                    <div className="flex w-full flex-wrap gap-x-4 gap-y-1 items-center">
                        <FormRadioButton
                            id="lowAdd"
                            label="Niedrig"
                            value="low"
                            currentPriority={updatedPriority}
                            onChange={handleUpdatePriority}
                            onKeyDown={handleEscape}
                        />
                        <FormRadioButton
                            id="mediumAdd"
                            label="Mittel"
                            value="middle"
                            currentPriority={updatedPriority}
                            onChange={handleUpdatePriority}
                            onKeyDown={handleEscape}
                        />
                        <FormRadioButton
                            id="highAdd"
                            label="Hoch"
                            value="high"
                            currentPriority={updatedPriority}
                            onChange={handleUpdatePriority}
                            onKeyDown={handleEscape}
                        />
                    </div>
                </fieldset>
            </div>
            <label
                htmlFor="descriptionUpdate"
                className="font-bold text-base md:text-lg"
            >
                Beschreibung:
            </label>
            <textarea
                className="resize-none h-20 outline-2 outline-zinc-500 rounded-md px-2 mb-2 text-sm md:text-base wrap-break-word"
                value={updatedDescription}
                id="descriptionUpdate"
                onChange={handleUpdateDescription}
                placeholder="Beschreibung hinzufügen"
                maxLength={255}
                onKeyDown={handleEscape}
            />
            <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                <ListButton
                    handleClick={applyUpdate}
                    index={index}
                    label="Anwenden"
                    isLoading={isLoading}
                    isSubmit
                    type="regular"
                />
                <ListButton
                    handleClick={handleCancel}
                    index={index}
                    isLoading={isLoading}
                    label="Abbrechen"
                    type="regular"
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
                <em className="text-sm md:text-base line-clamp-3 wrap-break-word">
                    {task.description}
                </em>
            ) : undefined}
            <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                {props.allowDelete ? (
                    <ListButton
                        handleClick={() =>
                            handleDeleteCompletedTask({
                                setCompletedTasks: props.setCompletedTasks,
                                setIsLoading: setIsLoading,
                                showToast: props.showToast,
                                task,
                                completedTasks: props.completedTasks,
                            })
                        }
                        index={index}
                        isLoading={isLoading}
                        label="Löschen"
                        type="regular"
                    />
                ) : undefined}
                {props.allowEdit ? (
                    <ListButton
                        handleClick={() => setIsEdit(true)}
                        index={index}
                        isLoading={isLoading}
                        label="Bearbeiten"
                        type="regular"
                    />
                ) : undefined}
                {props.allowComplete ? (
                    <ListButton
                        handleClick={() =>
                            handleCompleteTask({
                                setCompletedTasks: props.setCompletedTasks,
                                setIsLoading: setIsLoading,
                                setUpcomingTasks: props.setUpcomingTasks,
                                showToast: props.showToast,
                                task,
                                completedTasks: props.completedTasks,
                                upcomingTasks: props.upcomingTasks,
                            })
                        }
                        isLoading={isLoading}
                        index={index}
                        label="Erledigt"
                        type="regular"
                    />
                ) : undefined}
            </div>
        </div>
    )
}

export default ListTaskItem
