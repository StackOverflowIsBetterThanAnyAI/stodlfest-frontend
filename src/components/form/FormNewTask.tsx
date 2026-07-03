import { useState, type ChangeEvent } from 'react'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import FormHeader from './FormHeader'
import FormRadioButton from './FormRadioButton'
import { FetchLoading } from 'fetch-loading'
import { SERVER_ADDRESS } from '../../constants/constants'
import { useToast } from '../../context/ToastContext'

const FormNewTask = () => {
    const parsedSessionData = getStoredSessionData()
    const { showToast } = useToast()

    const [task, setTask] = useState<string>(parsedSessionData?.taskAdd || '')
    const [description, setDescription] = useState<string>(
        parsedSessionData?.descriptionAdd || ''
    )
    const [priority, setPriority] = useState<string>(
        parsedSessionData?.priorityAdd || 'middle'
    )
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(
        !parsedSessionData?.taskAdd?.length
    )
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
        setItemInSessionStorage('descriptionAdd', e.target.value)
    }
    const handleChangeTask = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setTask(input)
        setItemInSessionStorage('taskAdd', input)
        if (input.length) {
            setIsSubmitDisabled(false)
        } else {
            setIsSubmitDisabled(true)
        }
    }
    const handleChangePriority = (e: ChangeEvent<HTMLInputElement>) => {
        setPriority(e.target.value)
        setItemInSessionStorage('priorityAdd', e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const taskData = {
            task,
            description,
            priority,
        }

        try {
            setIsLoading(true)

            const response = await fetch(`${SERVER_ADDRESS}/api/tasks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                const error = errorData.task.join(' ')
                showToast({
                    isSuccess: false,
                    label: error,
                })
                return
            }

            setTask('')
            setDescription('')
            setPriority('middle')
            setIsSubmitDisabled(true)
            setItemInSessionStorage('taskAdd', '')
            setItemInSessionStorage('descriptionAdd', '')
            setItemInSessionStorage('priorityAdd', 'middle')
        } catch {
            showToast({
                isSuccess: false,
                label: 'Beim Hinzufügen dieser Aufgabe ist ein Fehler aufgetreten.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const inputClass =
        'w-full outline outline-zinc-500 rounded-lg px-2 py-1 bg-slate-800 hover:bg-slate-700/50 text-sm md:text-base'

    return (
        <form
            className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full"
            onSubmit={handleSubmit}
        >
            <FormHeader label="Neue Aufgabe anlegen" />
            <div className="flex flex-wrap gap-2 items-center">
                <label
                    htmlFor="taskAdd"
                    className="font-bold text-base md:text-lg"
                >
                    Aufgabe:
                </label>
                <input
                    type="text"
                    placeholder="Aufgabe"
                    id="taskAdd"
                    className={`min-w-32 ${inputClass}`}
                    onChange={handleChangeTask}
                    value={task}
                    maxLength={127}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="descriptionAdd"
                    className="font-bold text-base md:text-lg"
                >
                    Beschreibung:
                </label>
                <textarea
                    placeholder="Beschreibung"
                    id="descriptionAdd"
                    className={`resize-none ${inputClass}`}
                    onChange={handleChangeDescription}
                    value={description}
                    maxLength={255}
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
                        currentPriority={priority}
                        onChange={handleChangePriority}
                    />
                    <FormRadioButton
                        id="mediumAdd"
                        label="Mittel"
                        value="middle"
                        currentPriority={priority}
                        onChange={handleChangePriority}
                    />
                    <FormRadioButton
                        id="highAdd"
                        label="Hoch"
                        value="high"
                        currentPriority={priority}
                        onChange={handleChangePriority}
                    />
                </div>
            </fieldset>
            {isLoading ? (
                <div className="rounded-sm outline-2 outline-zinc-500 h-8 md:h-10 w-full flex justify-center items-center">
                    <FetchLoading theme="#71717b" />
                </div>
            ) : (
                <button
                    type="submit"
                    className="secondary-text-pseudo outline-2 outline-zinc-500 px-2 text-base md:text-lg h-8 md:h-10"
                    disabled={isSubmitDisabled || isLoading}
                >
                    Aufgabe anlegen
                </button>
            )}
        </form>
    )
}

export default FormNewTask
