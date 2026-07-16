import { SERVER_ADDRESS } from '../constants/constants'
import type { handleDeleteJobProps, JobProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleDeleteJob = async ({
    allJobs,
    job,
    setAllJobs,
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
    } catch {
        showToast({
            label: 'Beim Löschen der Aufgabe ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
