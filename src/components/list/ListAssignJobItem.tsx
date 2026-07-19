import { useContext, useState } from 'react'
import ListAssignJobItemDnD from './ListAssignJobItemDnD'
import { AllMembersContext } from '../../context/AllMembersContext'
import { useToast } from '../../context/ToastContext'
import { useScreenWidth } from '../../hooks/useScreenWidth'
import type {
    ListAssignJobItemProps,
    TargetActionType,
} from '../../types/types'

const ListAssignJobItem = ({ index, job }: ListAssignJobItemProps) => {
    const { showToast } = useToast()

    const allMembersContext = useContext(AllMembersContext)
    if (!allMembersContext) {
        throw new Error(
            'ListAssignJobItem must be used within a AllMembersContext.Provider'
        )
    }
    const [allMembers, setAllMembers] = allMembersContext

    const SCREEN_WIDTH = useScreenWidth()
    const [activeTargetZone, setActiveTargetZone] =
        useState<TargetActionType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const currentWorkersCount =
        allMembers?.filter((member) => member.job === job.job).length || 0

    return (
        <div
            className={`py-2 px-3 flex flex-col gap-2 ${index % 2 ? 'bg-slate-800' : 'bg-slate-700'} rounded-sm ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
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
                    <span
                        className="text-base md:text-lg"
                        aria-hidden="true"
                    >{`${currentWorkersCount}/${job.workers} erforderlichen Helfern`}</span>
                    <span className="sr-only">{`${currentWorkersCount} von ${job.workers} erforderlichen Helfern`}</span>
                </div>
            ) : (
                <div className="gap-4 grid grid-cols-[1fr_2fr_1fr] items-center">
                    <span className="text-base md:text-lg">{job.job}</span>
                    <span
                        className="text-base md:text-lg text-center"
                        aria-hidden="true"
                    >{`${currentWorkersCount}/${job.workers} erforderlichen Helfern`}</span>
                    <span className="sr-only">{`${currentWorkersCount} von ${job.workers} erforderlichen Helfern`}</span>
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
                </div>
            )}
            <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50 w-full">
                <ListAssignJobItemDnD
                    activeTargetZone={activeTargetZone}
                    allMembers={allMembers}
                    currentWorkersCount={currentWorkersCount}
                    isToBeAssigned
                    job={job}
                    setActiveTargetZone={setActiveTargetZone}
                    setAllMembers={setAllMembers}
                    setIsLoading={setIsLoading}
                    showToast={showToast}
                />
                <ListAssignJobItemDnD
                    activeTargetZone={activeTargetZone}
                    allMembers={allMembers}
                    currentWorkersCount={currentWorkersCount}
                    job={job}
                    setActiveTargetZone={setActiveTargetZone}
                    setAllMembers={setAllMembers}
                    setIsLoading={setIsLoading}
                    showToast={showToast}
                />
            </div>
        </div>
    )
}

export default ListAssignJobItem
