import { useContext, useState, type ChangeEvent } from 'react'
import FormRadioButton from '../form/FormRadioButton'
import ListButton from './ListButton'
import { handleApplyUpdateJob } from '../../api/handleApplyUpdateJob'
import { handleDeleteJob } from '../../api/handleDeleteJob'
import { useToast } from '../../context/ToastContext'
import { AllJobsContext } from '../../context/AllJobsContext'
import { AllMembersContext } from '../../context/AllMembersContext'
import { useScreenWidth } from '../../hooks/useScreenWidth'
import type { ListJobsItemProps, RequiresLegalAgeType } from '../../types/types'

const ListJobsItem = ({ index, job }: ListJobsItemProps) => {
    const { showToast } = useToast()

    const allJobsContext = useContext(AllJobsContext)
    if (!allJobsContext) {
        throw new Error(
            'ListJobsItem must be used within a AllJobsContext.Provider'
        )
    }
    const [allJobs, setAllJobs] = allJobsContext

    const allMembersContext = useContext(AllMembersContext)
    if (!allMembersContext) {
        throw new Error(
            'ListJobsItem must be used within a AllMembersContext.Provider'
        )
    }
    const [allMembers, setAllMembers] = allMembersContext

    const JOB_LENGTH = 63
    const SCREEN_WIDTH = useScreenWidth()

    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [updatedJob, setUpdatedJob] = useState<string>(job.job)
    const [updatedRequiresLegalAge, setUpdatedRequiresLegalAge] =
        useState<RequiresLegalAgeType>(job.requires_legal_age)
    const [updatedWorkers, setUpdatedWorkers] = useState<number>(job.workers)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleApplyUpdateJob({
            allJobs,
            allMembers,
            job,
            setAllJobs,
            setAllMembers,
            setIsEdit,
            setIsLoading,
            showToast,
            updatedJob,
            updatedRequiresLegalAge,
            updatedWorkers,
        })
    }
    const handleCancel = () => {
        setUpdatedJob(job.job)
        setUpdatedRequiresLegalAge(job.requires_legal_age)
        setUpdatedWorkers(job.workers)
        setIsEdit(false)
    }
    const handleDelete = async () => {
        handleDeleteJob({
            allJobs,
            allMembers,
            job,
            setAllJobs,
            setAllMembers,
            setIsLoading,
            showToast,
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

    const handleChangeJob = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdatedJob(e.target.value)
    }
    const handleChangeRequiresLegalAge = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdatedRequiresLegalAge(e.target.value as RequiresLegalAgeType)
    }
    const handleChangeWorkers = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdatedWorkers(parseInt(e.target.value) || job.workers)
    }

    return isEdit ? (
        <form
            className={`py-2 px-3 flex flex-col gap-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm outline-2 outline-zinc-500`}
            onSubmit={handleSubmit}
        >
            <div className="flex flex-wrap gap-2 items-end">
                <label
                    htmlFor={`jobUpdate${job.id}`}
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
                    id={`jobUpdate${job.id}`}
                    className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'} min-w-32 w-full outline outline-zinc-500 rounded-lg px-2 py-1 text-sm md:text-base`}
                    onChange={handleChangeJob}
                    onKeyDown={handleEscape}
                    value={updatedJob}
                    maxLength={JOB_LENGTH}
                    required
                />
            </div>
            <div className="flex flex-wrap gap-2 items-end">
                <label
                    htmlFor={`workersUpdate${job.id}`}
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
                        {updatedWorkers}
                    </span>
                    <input
                        type="range"
                        placeholder="1"
                        id={`workersUpdate${job.id}`}
                        className={`${index % 2 ? 'primary-text-pseudo-secondary' : 'primary-text-pseudo'}min-w-32 w-full outline outline-zinc-500 rounded-lg px-2 py-1 text-sm md:text-base`}
                        onChange={handleChangeWorkers}
                        onKeyDown={handleEscape}
                        value={updatedWorkers}
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
                        id={`noLegalAgeUpdate${job.id}`}
                        label="Nein"
                        name="requiresLegalAge"
                        value="doesNotRequireLegalAge"
                        currentValue={updatedRequiresLegalAge}
                        onChange={handleChangeRequiresLegalAge}
                        onKeyDown={handleEscape}
                    />
                    <FormRadioButton
                        id={`legalAgeUpdate${job.id}`}
                        label="Ja"
                        name="requiresLegalAge"
                        value="doesRequireLegalAge"
                        currentValue={updatedRequiresLegalAge}
                        onChange={handleChangeRequiresLegalAge}
                        onKeyDown={handleEscape}
                    />
                </div>
            </fieldset>
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
            {SCREEN_WIDTH === 'MOBILE' ? (
                <div className="flex flex-col gap-2">
                    <span className="flex justify-between">
                        <span className="text-base md:text-lg">{job.job}</span>
                        {job.requires_legal_age === 'doesRequireLegalAge' ? (
                            <span className="text-sm md:text-base text-right self-start font-bold w-full">
                                <span
                                    aria-hidden="true"
                                    className="inline-flex justify-center items-center p-1 outline-2 outline-zinc-200 rounded-full aspect-square"
                                >
                                    18+
                                </span>
                                <span className="sr-only">
                                    Volljährigkeit erforderlich
                                </span>
                            </span>
                        ) : (
                            <span className="sr-only">
                                Keine Volljährigkeit erforderlich
                            </span>
                        )}
                    </span>
                    <span className="text-base md:text-lg">
                        {`${job.workers} erforderliche Helfer`}
                    </span>
                </div>
            ) : (
                <span className="gap-4 grid grid-cols-3 items-center">
                    <span className="text-base md:text-lg">{job.job}</span>
                    <span className="text-base md:text-lg">
                        {`${job.workers} erforderliche Helfer`}
                    </span>
                    {job.requires_legal_age === 'doesRequireLegalAge' ? (
                        <span className="text-sm md:text-base text-right self-start font-bold w-full">
                            <span
                                aria-hidden="true"
                                className="inline-flex justify-center items-center p-1 outline-2 outline-zinc-200 rounded-full aspect-square"
                            >
                                18+
                            </span>
                            <span className="sr-only">
                                Volljährigkeit erforderlich
                            </span>
                        </span>
                    ) : (
                        <span className="sr-only">
                            Keine Volljährigkeit erforderlich
                        </span>
                    )}
                </span>
            )}
            <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50">
                <ListButton
                    handleClick={() => setIsEdit(true)}
                    index={index}
                    isLoading={isLoading}
                    label="Bearbeiten"
                    type="regular"
                />
                <ListButton
                    handleClick={handleDelete}
                    index={index}
                    isLoading={isLoading}
                    label="Löschen"
                    type="regular"
                />
            </div>
        </div>
    )
}

export default ListJobsItem
