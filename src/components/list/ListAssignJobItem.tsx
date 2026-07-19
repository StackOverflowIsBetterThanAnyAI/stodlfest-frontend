import { useContext, useState, type DragEvent } from 'react'
import { handleAssignMemberToJob } from '../../api/handleAssignMemberToJob'
import { AllMembersContext } from '../../context/AllMembersContext'
import { useToast } from '../../context/ToastContext'
import { useScreenWidth } from '../../hooks/useScreenWidth'
import type {
    ListAssignJobItemProps,
    MemberProps,
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

    const handleKeyDown = async (
        e: React.KeyboardEvent<HTMLButtonElement>,
        member: MemberProps,
        targetAction: TargetActionType
    ) => {
        if (e.key !== ' ' && e.key !== 'Enter') {
            return
        }

        e.preventDefault()

        setActiveTargetZone(null)

        const draggedMember = allMembers?.find((item) => item.id === member.id)

        if (!draggedMember) {
            return
        }

        if (targetAction === 'assign') {
            if (draggedMember.job === job.job) {
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
                <ul
                    className={`flex flex-wrap gap-x-4 gap-y-2 items-start content-start overflow-y-auto h-32 p-2 flex-1 min-w-44 xs:min-w-64 rounded-md
                                ${activeTargetZone === 'unassign' ? 'outline-dashed outline-2 outline-slate-200 bg-slate-200 animate-pulse' : 'bg-slate-400'}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'unassign')}
                    aria-label="Verfügbare Mitglieder"
                >
                    {allMembers?.length
                        ? allMembers
                              ?.filter((member) => {
                                  const hasNoJob = !member.job?.length
                                  const meetsAgeRequirement =
                                      job.requires_legal_age !==
                                          'doesRequireLegalAge' ||
                                      member.age === 'ofLegalAge'
                                  return hasNoJob && meetsAgeRequirement
                              })
                              .map((member) => (
                                  <li
                                      key={member.id}
                                      draggable={
                                          currentWorkersCount !== job.workers
                                      }
                                      onDragStart={(e) =>
                                          handleDragStart(e, member.id)
                                      }
                                      onDragEnd={handleDragEnd}
                                  >
                                      <button
                                          disabled={
                                              currentWorkersCount ===
                                              job.workers
                                          }
                                          onKeyDown={(e) =>
                                              handleKeyDown(e, member, 'assign')
                                          }
                                          className={`primary-text-pseudo-tertiary bg-slate-800 text-white px-2 py-1 text-sm md:text-base select-none 
                                                ${currentWorkersCount === job.workers ? '' : 'hover:cursor-grab! active:cursor-grabbing!'}`}
                                      >
                                          {member.surname} {member.name}
                                      </button>
                                  </li>
                              ))
                        : undefined}
                </ul>
                <ul
                    className={`flex flex-wrap gap-x-4 gap-y-2 items-start content-start overflow-y-auto h-32 p-2 flex-1 min-w-44 xs:min-w-64 rounded-md
                                ${activeTargetZone === 'assign' ? 'outline-dashed outline-2 outline-slate-200 bg-slate-200 animate-pulse' : 'bg-slate-400'}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'assign')}
                    aria-label="Dieser Aufgabe zugewiesene Mitglieder"
                >
                    {allMembers?.length
                        ? allMembers
                              .filter((member) => member?.job === job.job)
                              .map((member) => (
                                  <li
                                      key={member.id}
                                      draggable
                                      onDragStart={(e) =>
                                          handleDragStart(e, member.id)
                                      }
                                      onDragEnd={handleDragEnd}
                                  >
                                      <button
                                          onKeyDown={(e) =>
                                              handleKeyDown(
                                                  e,
                                                  member,
                                                  'unassign'
                                              )
                                          }
                                          className="primary-text-pseudo-tertiary bg-slate-800 text-white px-2 py-1 text-sm md:text-base select-none hover:cursor-grab! active:cursor-grabbing!"
                                      >
                                          {member.surname} {member.name}
                                      </button>
                                  </li>
                              ))
                        : undefined}
                </ul>
            </div>
        </div>
    )
}

export default ListAssignJobItem
