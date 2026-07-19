import { SERVER_ADDRESS } from '../constants/constants'
import type { handleDeleteJobProps, JobProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleDeleteJob = async ({
    allJobs,
    allMembers,
    job,
    setAllJobs,
    setAllMembers,
    setIsLoading,
    showToast,
}: handleDeleteJobProps) => {
    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/jobs/${job.id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            showToast({
                label: 'Aufgabe konnte nicht gelöscht werden.',
            })
            return
        }

        const updatedJobs =
            allJobs?.filter((item: JobProps) => item.id !== job.id) || []
        setAllJobs(updatedJobs)
        setItemInSessionStorage('allJobs', updatedJobs)

        const updatedMembers =
            allMembers?.map((item) => {
                if (item.job === job.job) {
                    return { ...item, job: null }
                }
                return item
            }) || []
        setAllMembers(updatedMembers)
        setItemInSessionStorage('allMembers', updatedMembers)
    } catch {
        showToast({
            label: 'Beim Löschen der Aufgabe ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
