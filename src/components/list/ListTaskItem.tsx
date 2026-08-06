import { useContext, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import FormRadioButton from '../form/FormRadioButton'
import ListButton from './ListButton'
import ListPriority from './ListPriority'
import { handleApplyUpdateTask } from '../../api/handleApplyUpdateTask'
import { handleCompleteTask } from '../../api/handleCompleteTask'
import { handleDeleteCompletedTask } from '../../api/handleDeleteCompletedTask'
import { handleRestoreCompletedTask } from '../../api/handleRestoreCompletedTask'
import { IsLoggedInContext } from '../../context/IsLoggedInContext'
import { useToast } from '../../context/ToastContext'
import { UpcomingTasksContext } from '../../context/UpcomingTasksContext'
import type { ListTaskItemProps, PriorityType } from '../../types/types'
import { getStoredLocalData } from '../../utils/getStoredLocalData'
import { setItemInLocalStorage } from '../../utils/setItemInLocalStorage'

const ListTaskItem = ({ props, task, index }: ListTaskItemProps) => {
    const navigate = useNavigate()
    const { showToast } = useToast()

    const upcomingTasksContext = useContext(UpcomingTasksContext)
    if (!upcomingTasksContext) {
        throw new Error(
            'ListTaskItem must be used within a UpcomingTasksContext.Provider'
        )
    }
    const [upcomingTasks, setUpcomingTasks] = upcomingTasksContext

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error(
            'ListTaskItem must be used within a IsLoggedInContext.Provider'
        )
    }
    const [_isLoggedIn, setIsLoggedIn] = isLoggedInContext

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

        const parsedLocalData = getStoredLocalData()
        const accessToken = (() => {
            const data = parsedLocalData?.accessToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('accessToken', '')
            return ''
        })()
        const refreshToken = (() => {
            const data = parsedLocalData?.refreshToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('refreshToken', '')
            return ''
        })()

        handleApplyUpdateTask({
            accessToken,
            navigate,
            refreshToken,
            setIsEdit,
            setIsLoading,
            setIsLoggedIn,
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
        setUpdatedPriority(task.priority)
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

    const handleRestore = () => {
        if (!props.allowRestore) {
            return
        }

        const parsedLocalData = getStoredLocalData()
        const accessToken = (() => {
            const data = parsedLocalData?.accessToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('accessToken', '')
            return ''
        })()
        const refreshToken = (() => {
            const data = parsedLocalData?.refreshToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('refreshToken', '')
            return ''
        })()

        handleRestoreCompletedTask({
            accessToken,
            completedTasks: props.completedTasks,
            navigate,
            refreshToken,
            setCompletedTasks: props.setCompletedTasks,
            setIsLoading,
            setIsLoggedIn,
            setUpcomingTasks: setUpcomingTasks,
            showToast,
            task,
        })
    }
    const handleDelete = () => {
        if (!props.allowDelete) {
            return
        }

        const parsedLocalData = getStoredLocalData()
        const accessToken = (() => {
            const data = parsedLocalData?.accessToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('accessToken', '')
            return ''
        })()
        const refreshToken = (() => {
            const data = parsedLocalData?.refreshToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('refreshToken', '')
            return ''
        })()

        handleDeleteCompletedTask({
            accessToken,
            navigate,
            refreshToken,
            setCompletedTasks: props.setCompletedTasks,
            setIsLoading,
            setIsLoggedIn,
            showToast,
            task,
            completedTasks: props.completedTasks,
        })
    }
    const handleComplete = () => {
        if (!props.allowComplete) {
            return
        }

        const parsedLocalData = getStoredLocalData()
        const accessToken = (() => {
            const data = parsedLocalData?.accessToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('accessToken', '')
            return ''
        })()
        const refreshToken = (() => {
            const data = parsedLocalData?.refreshToken
            if (data?.length && typeof data === 'string') {
                return data
            }
            setItemInLocalStorage('refreshToken', '')
            return ''
        })()

        handleCompleteTask({
            accessToken,
            navigate,
            refreshToken,
            setCompletedTasks: props.setCompletedTasks,
            setIsLoading,
            setIsLoggedIn,
            setUpcomingTasks: props.setUpcomingTasks,
            showToast,
            task,
            completedTasks: props.completedTasks,
            upcomingTasks: props.upcomingTasks,
        })
    }

    return isEdit ? (
        <form
            className={`py-2 px-3 flex flex-col gap-x-4 gap-y-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm outline-2 outline-zinc-500`}
            onSubmit={handleSubmit}
        >
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-between items-center">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <span className="flex flex-wrap gap-x-2 gap-y-1 items-end">
                        <label
                            htmlFor={`taskUpdate${task.id}`}
                            className="font-bold text-base md:text-lg"
                        >
                            Aufgabe:
                        </label>
                        <em
                            className="text-xs md:text-sm pb-1 text-zinc-300"
                            aria-hidden="true"
                        >
                            * erforderlich
                        </em>
                    </span>
                    <input
                        type="text"
                        className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} min-w-32 w-full outline-2 outline-zinc-500 rounded-md px-2 text-base md:text-lg truncate`}
                        value={updatedTask}
                        id={`taskUpdate${task.id}`}
                        onChange={handleUpdateTask}
                        onKeyDown={handleEscape}
                        maxLength={127}
                        required
                    />
                </div>
                <fieldset>
                    <legend className="font-bold text-base md:text-lg float-left pr-2">
                        <em className="sr-only">erforderlich</em>Priorität:
                    </legend>
                    <em
                        className="text-xs md:text-sm pb-1 inline-block text-zinc-300"
                        aria-hidden="true"
                    >
                        * erforderlich
                    </em>
                    <div className="flex w-full flex-wrap gap-x-4 gap-y-1 items-center">
                        <FormRadioButton
                            id={`lowUpdate${task.id}`}
                            label="Niedrig"
                            name="updatePriority"
                            value="low"
                            currentValue={updatedPriority}
                            onChange={handleUpdatePriority}
                            onKeyDown={handleEscape}
                        />
                        <FormRadioButton
                            id={`mediumUpdate${task.id}`}
                            label="Mittel"
                            name="updatePriority"
                            value="middle"
                            currentValue={updatedPriority}
                            onChange={handleUpdatePriority}
                            onKeyDown={handleEscape}
                        />
                        <FormRadioButton
                            id={`highUpdate${task.id}`}
                            label="Hoch"
                            name="updatePriority"
                            value="high"
                            currentValue={updatedPriority}
                            onChange={handleUpdatePriority}
                            onKeyDown={handleEscape}
                        />
                    </div>
                </fieldset>
            </div>
            <label
                htmlFor={`descriptionUpdate${task.id}`}
                className="font-bold text-base md:text-lg"
            >
                Beschreibung:
            </label>
            <textarea
                className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} resize-none h-20 outline-2 outline-zinc-500 rounded-md px-2 mb-2 text-sm md:text-base wrap-break-word`}
                value={updatedDescription}
                id={`descriptionUpdate${task.id}`}
                onChange={handleUpdateDescription}
                placeholder="Beschreibung hinzufügen"
                maxLength={255}
                onKeyDown={handleEscape}
            />
            <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                <ListButton
                    handleClick={() => {}}
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
                <span className="text-sm md:text-base line-clamp-3 wrap-break-word">
                    {task.description}
                </span>
            ) : undefined}
            <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                {props.allowRestore ? (
                    <ListButton
                        handleClick={handleRestore}
                        index={index}
                        isLoading={isLoading}
                        label="Wiederherstellen"
                        type="regular"
                    />
                ) : undefined}
                {props.allowDelete ? (
                    <ListButton
                        handleClick={handleDelete}
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
                        handleClick={handleComplete}
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
