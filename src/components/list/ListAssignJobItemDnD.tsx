import { handleAssignMemberToJob } from '../../api/handleAssignMemberToJob'
import type {
    TargetActionType,
    MemberProps,
    ListAssignJobItemDnDProps,
} from '../../types/types'

const ListAssignJobItemDnD = ({
    activeTargetZone,
    allMembers,
    currentWorkersCount,
    isToBeAssigned = false,
    job,
    setActiveTargetZone,
    setAllMembers,
    setIsLoading,
    showToast,
}: ListAssignJobItemDnDProps) => {
    const handleDragStart = (
        e: React.DragEvent<HTMLLIElement>,
        memberId: number
    ) => {
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

    const handleDragOver = (
        e: React.DragEvent<HTMLDivElement | HTMLUListElement>
    ) => {
        e.preventDefault()
    }

    const handleDrop = async (
        e: React.DragEvent<HTMLDivElement | HTMLUListElement>,
        targetAction: TargetActionType
    ) => {
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

    const { underAgedMembersNoJob, ofLegalAgeMembersNoJob } =
        allMembers?.reduce(
            (total, cur: MemberProps) => {
                if (!cur.job?.length) {
                    if (
                        job.requires_legal_age === 'doesNotRequireLegalAge' &&
                        cur.age === 'underage'
                    ) {
                        total.underAgedMembersNoJob.push(cur)
                    } else if (cur.age === 'ofLegalAge') {
                        total.ofLegalAgeMembersNoJob.push(cur)
                    }
                }
                return total
            },
            {
                underAgedMembersNoJob: [] as MemberProps[],
                ofLegalAgeMembersNoJob: [] as MemberProps[],
            }
        ) || { underAgedMembersNoJob: [], ofLegalAgeMembersNoJob: [] }

    return isToBeAssigned ? (
        <div
            className={`flex flex-wrap ${underAgedMembersNoJob?.length && ofLegalAgeMembersNoJob?.length ? 'gap-x-4 gap-y-2' : ''} items-start content-start overflow-y-auto h-32 p-2 flex-1 min-w-44 xs:min-w-64 rounded-md
                ${activeTargetZone === 'unassign' ? 'outline-dashed outline-2 outline-slate-200 bg-slate-200 animate-pulse' : 'bg-slate-400'}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'unassign')}
        >
            {underAgedMembersNoJob?.length ? (
                <ul
                    className={`flex flex-wrap gap-x-4 gap-y-2 items-start content-start ${ofLegalAgeMembersNoJob?.length ? 'border-b-2 border-zinc-200/75 pb-2 w-full' : ''}`}
                    aria-label="Minderjährige verfügbare Mitglieder"
                >
                    {underAgedMembersNoJob.map((member) => (
                        <li
                            key={member.id}
                            draggable={currentWorkersCount !== job.workers}
                            onDragStart={(e) => handleDragStart(e, member.id)}
                            onDragEnd={handleDragEnd}
                        >
                            <button
                                disabled={currentWorkersCount === job.workers}
                                onKeyDown={(e) =>
                                    handleKeyDown(e, member, 'assign')
                                }
                                className={`primary-text-pseudo-tertiary bg-slate-800 text-white px-2 py-1 text-sm md:text-base select-none 
                                                ${currentWorkersCount === job.workers ? '' : 'hover:cursor-grab! active:cursor-grabbing!'}`}
                            >
                                {member.surname} {member.name}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : undefined}
            {ofLegalAgeMembersNoJob?.length ? (
                <ul
                    className="flex flex-wrap gap-x-4 gap-y-2 items-start content-start"
                    aria-label="Volljährige verfügbare Mitglieder"
                >
                    {ofLegalAgeMembersNoJob.map((member) => (
                        <li
                            key={member.id}
                            draggable={currentWorkersCount !== job.workers}
                            onDragStart={(e) => handleDragStart(e, member.id)}
                            onDragEnd={handleDragEnd}
                        >
                            <button
                                disabled={currentWorkersCount === job.workers}
                                onKeyDown={(e) =>
                                    handleKeyDown(e, member, 'assign')
                                }
                                className={`primary-text-pseudo-tertiary bg-slate-800 text-white px-2 py-1 text-sm md:text-base select-none 
                                                ${currentWorkersCount === job.workers ? '' : 'hover:cursor-grab! active:cursor-grabbing!'}`}
                            >
                                {member.surname} {member.name}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : undefined}
        </div>
    ) : (
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
                              onDragStart={(e) => handleDragStart(e, member.id)}
                              onDragEnd={handleDragEnd}
                          >
                              <button
                                  onKeyDown={(e) =>
                                      handleKeyDown(e, member, 'unassign')
                                  }
                                  className="primary-text-pseudo-tertiary bg-slate-800 text-white px-2 py-1 text-sm md:text-base select-none hover:cursor-grab! active:cursor-grabbing!"
                              >
                                  {member.surname} {member.name}
                              </button>
                          </li>
                      ))
                : undefined}
        </ul>
    )
}

export default ListAssignJobItemDnD
