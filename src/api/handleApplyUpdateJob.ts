import { SERVER_ADDRESS } from '../constants/constants'
import type {
    handleApplyUpdateJobProps,
    JobProps,
    MemberProps,
} from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleApplyUpdateJob = async ({
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
}: handleApplyUpdateJobProps) => {
    if (
        job.job === updatedJob &&
        job.requires_legal_age === updatedRequiresLegalAge &&
        job.workers === updatedWorkers
    ) {
        setIsEdit(false)
        return
    }

    setIsLoading(true)

    try {
        const response = await fetch(`${SERVER_ADDRESS}/api/jobs/${job.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                job: updatedJob,
                requires_legal_age: updatedRequiresLegalAge,
                workers: updatedWorkers,
            }),
        })

        if (!response.ok) {
            showToast({
                label: 'Aufgabe konnten nicht aktualisiert werden.',
            })
            return
        }

        const updatedJobs = allJobs!.map((item: JobProps) => {
            if (item.id === job.id) {
                return {
                    ...item,
                    job: updatedJob,
                    requires_legal_age: updatedRequiresLegalAge,
                    workers: updatedWorkers,
                }
            }
            return item
        })
        setAllJobs(updatedJobs)
        setItemInSessionStorage('allJobs', updatedJobs)
        setIsEdit(false)

        const { jobMembers, notJobMembers } = allMembers?.reduce(
            (total, cur: MemberProps) => {
                if (cur.job === job.job) {
                    total.jobMembers.push(cur)
                } else {
                    total.notJobMembers.push(cur)
                }
                return total
            },
            {
                jobMembers: [] as MemberProps[],
                notJobMembers: [] as MemberProps[],
            }
        ) || { jobMembers: [], notJobMembers: [] }

        let jobMembersFiltered = [...jobMembers]
        let notJobMembersFiltered = [...notJobMembers]
        if (
            updatedRequiresLegalAge === 'doesRequireLegalAge' &&
            job.requires_legal_age === 'doesNotRequireLegalAge'
        ) {
            jobMembersFiltered = jobMembersFiltered?.map((member) =>
                member.age === 'underage' ? { ...member, job: null } : member
            )
            jobMembersFiltered = [
                ...(jobMembersFiltered?.filter(
                    (member) => member.job !== null
                ) || []),
            ]
            notJobMembersFiltered = [
                ...notJobMembersFiltered,
                ...(jobMembersFiltered?.filter(
                    (member) => member.job === null
                ) || []),
            ]
        }

        if (jobMembersFiltered.length > updatedWorkers) {
            jobMembersFiltered.sort((a, b) => {
                const surnameCompare = b.surname.localeCompare(a.surname, 'de')
                if (surnameCompare) {
                    return surnameCompare
                }
                return b.name.localeCompare(a.name, 'de')
            })
            const amountToBeRemoved = jobMembersFiltered.length - updatedWorkers
            const membersToBeRemoved = jobMembersFiltered.slice(
                0,
                amountToBeRemoved
            )
            const idsToBeRemoved = membersToBeRemoved.map((member) => member.id)
            jobMembersFiltered = jobMembersFiltered.map((member) =>
                idsToBeRemoved.includes(member.id)
                    ? { ...member, job: null }
                    : member
            )
            jobMembersFiltered = [
                ...(jobMembersFiltered?.filter((item) => item.job !== null) ||
                    []),
            ]
            notJobMembersFiltered = [
                ...notJobMembersFiltered,
                ...(jobMembersFiltered?.filter((item) => item.job === null) ||
                    []),
            ]
        }

        const updatedJobMembersFiltered =
            jobMembersFiltered?.map((member) => {
                return { ...member, job: updatedJob }
            }) || []

        const updatedMembers = [
            ...updatedJobMembersFiltered,
            ...notJobMembersFiltered,
        ].sort(
            (a, b) =>
                a.surname.localeCompare(b.surname, 'de') ||
                a.name.localeCompare(b.name, 'de')
        )
        setAllMembers(updatedMembers)
        setItemInSessionStorage('allMembers', updatedMembers)
    } catch {
        showToast({
            label: 'Beim Aktualisieren dieser Aufgabe ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
