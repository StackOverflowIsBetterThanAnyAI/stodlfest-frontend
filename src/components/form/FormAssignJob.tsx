import { useContext, useState, type DragEvent } from 'react'
import { useToast } from '../../context/ToastContext'
import { useScreenWidth } from '../../hooks/useScreenWidth'
import type { ListJobsItemProps, TargetActionType } from '../../types/types'
import { AllMembersContext } from '../../context/AllMembersContext'
import { handleAssignMemberToJob } from '../../api/handleAssignMemberToJob'

const FormAssignJob = ({ index, job }: ListJobsItemProps) => {
    const { showToast } = useToast()

    const allMembersContext = useContext(AllMembersContext)
    if (!allMembersContext) {
        throw new Error(
            'FormAssignJob must be used within a AllMembersContext.Provider'
        )
    }
    const [allMembers, setAllMembers] = allMembersContext

    const SCREEN_WIDTH = useScreenWidth()
    const [activeTargetZone, setActiveTargetZone] =
        useState<TargetActionType | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleDragStart = (e: DragEvent, memberId: number) => {
        e.dataTransfer.setData('text/plain', memberId.toString())
        e.dataTransfer.setData('sourceJobId', job.id.toString())

        const draggedMember = allMembers?.find(
            (member) => member.id === memberId
        )
        if (draggedMember) {
            if (draggedMember.job === job.job) {
                setActiveTargetZone('unassign')
            } else if (!draggedMember.job?.length) {
                setActiveTargetZone('assign')
            }
        }
    }

    const handleDragEnd = () => {
        setActiveTargetZone(null)
    }

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = async (e: DragEvent, targetAction: TargetActionType) => {
        e.preventDefault()
        setActiveTargetZone(null)

        const memberId = parseInt(e.dataTransfer.getData('text/plain'))
        const sourceJobId = parseInt(e.dataTransfer.getData('sourceJobId'))

        if (sourceJobId !== job.id) {
            showToast({
                label: 'Mitglieder können nicht zwischen verschiedenen Aufgaben verschoben werden.',
            })
            return
        }

        const draggedMember = allMembers?.find(
            (member) => member.id === memberId
        )

        if (!draggedMember) {
            return
        }

        if (targetAction === 'assign') {
            if (draggedMember.job === job.job) {
                return
            }
            const currentlyAssignedCount = allMembers?.filter(
                (member) => member.job === job.job
            ).length
            if (
                currentlyAssignedCount &&
                currentlyAssignedCount >= job.workers
            ) {
                showToast({
                    label: 'Maximale Anzahl an Helfern für diese Aufgabe erreicht.',
                })
                return
            }
        }

        await handleAssignMemberToJob({
            allMembers,
            job,
            member: draggedMember,
            setAllMembers,
            setIsLoading,
            showToast,
            targetAction,
        })
    }

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
                    <span className="text-base md:text-lg">{`${currentWorkersCount}/${job.workers} erforderlichen Helfern`}</span>
                </div>
            ) : (
                <span className="gap-4 grid grid-cols-3 items-center">
                    <span className="text-base md:text-lg">{job.job}</span>
                    <span className="text-base md:text-lg">{`${currentWorkersCount}/${job.workers} erforderlichen Helfern`}</span>
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
            <div className="flex flex-wrap justify-evenly gap-x-4 gap-y-3 pt-4 pb-1 border-t-2 border-zinc-200/50 w-full">
                <ul
                    className={`flex flex-wrap gap-x-4 gap-y-2 items-start content-start overflow-y-auto h-32 bg-slate-400 p-2 flex-1 min-w-44 xs:min-w-64 rounded-md transition-all
                                ${activeTargetZone === 'unassign' ? 'outline-dashed outline-2 outline-zinc-500 bg-slate-200! animate-pulse' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'unassign')}
                    aria-label="Verfügbare Mitglieder"
                >
                    {allMembers?.length
                        ? allMembers
                              ?.filter((item) => {
                                  const hasNoJob = !item.job?.length
                                  const meetsAgeRequirement =
                                      job.requires_legal_age !==
                                          'doesRequireLegalAge' ||
                                      item.age === 'ofLegalAge'
                                  return hasNoJob && meetsAgeRequirement
                              })
                              .map((item) => (
                                  <li
                                      key={item.id}
                                      className={`bg-slate-800 text-white rounded-md px-2 py-1 text-sm md:text-base select-none 
                                                ${currentWorkersCount === job.workers ? 'cursor-not-allowed' : 'hover:cursor-grab active:cursor-grabbing'}`}
                                      draggable={
                                          currentWorkersCount !== job.workers
                                      }
                                      onDragStart={(e) =>
                                          handleDragStart(e, item.id)
                                      }
                                      onDragEnd={handleDragEnd}
                                  >
                                      {item.surname} {item.name}
                                  </li>
                              ))
                        : undefined}
                </ul>
                <ul
                    className={`flex flex-wrap gap-x-4 gap-y-2 items-start content-start overflow-y-auto h-32 bg-slate-400 p-2 flex-1 min-w-44 xs:min-w-64 rounded-md transition-all
                                ${activeTargetZone === 'assign' ? 'outline-dashed outline-2 outline-zinc-500 bg-slate-200! animate-pulse' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'assign')}
                    aria-label="Dieser Aufgabe zugewiesene Mitglieder"
                >
                    {allMembers?.length
                        ? allMembers
                              .filter((item) => item?.job === job.job)
                              .map((item) => (
                                  <li
                                      key={item.id}
                                      className="bg-slate-800 text-white rounded-md px-2 py-1 text-sm md:text-base hover:cursor-grab active:cursor-grabbing select-none"
                                      draggable
                                      onDragStart={(e) =>
                                          handleDragStart(e, item.id)
                                      }
                                      onDragEnd={handleDragEnd}
                                  >
                                      {item.surname} {item.name}
                                  </li>
                              ))
                        : undefined}
                </ul>
            </div>
        </div>
    )
}

export default FormAssignJob
