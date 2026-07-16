import { useContext, useState, type ChangeEvent } from 'react'
import FormRadioButton from './FormRadioButton'
import Header from '../header/Header'
import ListButton from '../list/ListButton'
import { handleAddNewJob } from '../../api/handleAddNewJob'
import { useToast } from '../../context/ToastContext'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { AllJobsContext } from '../../context/AllJobsContext'
import type { RequiresLegalAgeType } from '../../types/types'

const FormNewJob = () => {
    const parsedSessionData = getStoredSessionData()
    const { showToast } = useToast()

    const allJobsContext = useContext(AllJobsContext)
    if (!allJobsContext) {
        throw new Error(
            'FormNewJob must be used within a AllJobsContext.Provider'
        )
    }
    const [_allJobs, setAllJobs] = allJobsContext

    const JOB_LENGTH = 63

    const [job, setJob] = useState<string>(() => {
        const data = parsedSessionData?.jobAdd
        if (data?.length && typeof data === 'string') {
            const slicedData = data.slice(0, JOB_LENGTH)
            setItemInSessionStorage('jobAdd', slicedData)
            return slicedData
        }
        setItemInSessionStorage('jobAdd', '')
        return ''
    })
    const [requiresLegalAge, setRequiresLegalAge] =
        useState<RequiresLegalAgeType>(() => {
            const data = parsedSessionData?.requiresLegalAgeAdd
            if (
                data?.length &&
                (data === 'doesRequireLegalAge' ||
                    data === 'doesNotRequireLegalAge')
            ) {
                setItemInSessionStorage('requiresLegalAgeAdd', data)
                return data
            }
            setItemInSessionStorage(
                'requiresLegalAgeAdd',
                'doesNotRequireLegalAge'
            )
            return 'doesNotRequireLegalAge'
        })
    const [workers, setWorkers] = useState<number>(() => {
        const data = parsedSessionData?.workersAdd
        if (data && typeof data === 'number') {
            setItemInSessionStorage('workersAdd', data)
            return data
        }
        setItemInSessionStorage('workersAdd', 1)
        return 1
    })
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(
        !parsedSessionData?.jobAdd?.length || !parsedSessionData?.workersAdd
    )
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleChangeJob = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setJob(input)
        setItemInSessionStorage('jobAdd', input)
        setIsSubmitDisabled(!input?.length || !workers)
    }
    const handleChangeWorkers = (e: ChangeEvent<HTMLInputElement>) => {
        const input = parseInt(e.target.value)
        setWorkers(input || 1)
        setItemInSessionStorage('workersAdd', input)
        setIsSubmitDisabled(!input || !job?.length)
    }
    const handleChangeRequiresLegalAge = (e: ChangeEvent<HTMLInputElement>) => {
        setRequiresLegalAge(e.target.value as RequiresLegalAgeType)
        setItemInSessionStorage('requiresLegalAgeAdd', e.target.value)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        handleAddNewJob({
            e,
            job,
            requiresLegalAge,
            setAllJobs,
            setIsLoading,
            setIsSubmitDisabled,
            setJob,
            setWorkers,
            showToast,
            workers,
        })
    }

    return (
        <form
            className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full"
            onSubmit={handleSubmit}
        >
            <Header label="Neue Aufgabe anlegen" />
            <div className="flex flex-wrap gap-2 items-end">
                <label
                    htmlFor="jobAdd"
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
                <input
                    type="text"
                    placeholder="Aufgabe"
                    id="jobAdd"
                    className="min-w-32 w-full outline outline-zinc-500 rounded-lg px-2 py-1 bg-slate-800 hover:bg-slate-700/40 text-sm md:text-base"
                    onChange={handleChangeJob}
                    value={job}
                    maxLength={JOB_LENGTH}
                    required
                />
            </div>
            <div className="flex flex-wrap gap-2 items-end">
                <label
                    htmlFor="workersAdd"
                    className="font-bold text-base md:text-lg"
                >
                    <em className="sr-only">erforderlich</em>
                    Helfer:
                </label>
                <em
                    className="text-xs md:text-sm pb-1 text-zinc-300"
                    aria-hidden="true"
                >
                    * erforderlich
                </em>
                <span className="flex justify-center items-end w-full gap-4">
                    <span
                        className="text-sm md:text-base w-3 md:w-4"
                        aria-hidden="true"
                    >
                        {workers}
                    </span>
                    <input
                        type="range"
                        placeholder="1"
                        id="workersAdd"
                        className="min-w-32 w-full outline outline-zinc-500 rounded-lg px-2 py-1 bg-slate-800 hover:bg-slate-700/40 text-sm md:text-base"
                        onChange={handleChangeWorkers}
                        value={workers}
                        min={1}
                        max={15}
                        step={1}
                        required
                    />
                </span>
            </div>
            <fieldset className="flex flex-wrap gap-x-2 gap-y-1 items-end">
                <legend className="font-bold text-base md:text-lg float-left">
                    <em className="sr-only">erforderlich</em>
                    Erfordert Volljährigkeit:
                </legend>
                <em
                    className="text-xs md:text-sm pb-1 inline-block text-zinc-300"
                    aria-hidden="true"
                >
                    * erforderlich
                </em>
                <div className="flex w-full flex-wrap gap-x-4 gap-y-1 items-center">
                    <FormRadioButton
                        id="noLegalAgeAdd"
                        label="Nein"
                        name="requiresLegalAge"
                        value="doesNotRequireLegalAge"
                        currentValue={requiresLegalAge}
                        onChange={handleChangeRequiresLegalAge}
                    />
                    <FormRadioButton
                        id="legalAgeAdd"
                        label="Ja"
                        name="requiresLegalAge"
                        value="doesRequireLegalAge"
                        currentValue={requiresLegalAge}
                        onChange={handleChangeRequiresLegalAge}
                    />
                </div>
            </fieldset>
            <ListButton
                handleClick={() => {}}
                isLoading={isLoading}
                isDisabled={isSubmitDisabled}
                label="Aufgabe anlegen"
                isSubmit
                type="form"
            />
        </form>
    )
}

export default FormNewJob
