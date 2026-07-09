import { useContext, useState, type ChangeEvent } from 'react'
import Header from '../header/Header'
import ListButton from '../list/ListButton'
import { handleAddNewJob } from '../../api/handleAddNewJob'
import { useToast } from '../../context/ToastContext'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { AllJobsContext } from '../../context/AllJobsContext'

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
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        handleAddNewJob({
            e,
            job,
            setAllJobs,
            setIsLoading,
            setIsSubmitDisabled,
            setJob,
            setWorkers,
            showToast,
            workers,
        })
    }

    const inputClass =
        'w-full outline outline-zinc-500 rounded-lg px-2 py-1 bg-slate-800 hover:bg-slate-700/50 text-sm md:text-base'

    return (
        <form
            className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full"
            onSubmit={handleSubmit}
        >
            <Header label="Neue Arbeit anlegen" />
            <div className="flex flex-wrap gap-2 items-center">
                <label
                    htmlFor="jobAdd"
                    className="font-bold text-base md:text-lg"
                >
                    Arbeit:
                </label>
                <input
                    type="text"
                    placeholder="Arbeit"
                    id="jobAdd"
                    className={`min-w-32 ${inputClass}`}
                    onChange={handleChangeJob}
                    value={job}
                    maxLength={JOB_LENGTH}
                    required
                />
                <label
                    htmlFor="workersAdd"
                    className="font-bold text-base md:text-lg"
                >
                    Helfer:
                </label>
                <span className="text-sm md:text-base">{workers}</span>
                <input
                    type="range"
                    placeholder="1"
                    id="workersAdd"
                    className={`min-w-32 ${inputClass}`}
                    onChange={handleChangeWorkers}
                    value={workers}
                    min={1}
                    max={15}
                    step={1}
                    required
                />
            </div>
            <ListButton
                handleClick={() => {}}
                isLoading={isLoading}
                isDisabled={isSubmitDisabled}
                label="Arbeit anlegen"
                isSubmit
                type="form"
            />
        </form>
    )
}

export default FormNewJob
