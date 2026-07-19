import { SERVER_ADDRESS } from '../constants/constants'
import type { handleApplyUpdateJobProps, JobProps } from '../types/types'
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

        const updatedMembers =
            allMembers?.map((item) => {
                if (item.job === job.job) {
                    if (
                        updatedRequiresLegalAge === 'doesRequireLegalAge' &&
                        item.age === 'underage'
                    ) {
                        return { ...item, job: null }
                    }
                    if (job.job !== updatedJob) {
                        return { ...item, job: updatedJob }
                    }
                }
                return item
            }) || []
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
