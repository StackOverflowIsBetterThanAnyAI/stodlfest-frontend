import { SERVER_ADDRESS } from '../constants/constants'
import type { handleDeleteJobProps, JobProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleDeleteJob = async ({
    accessToken,
    allJobs,
    allMembers,
    job,
    navigate,
    setAllJobs,
    setAllMembers,
    setIsLoading,
    setIsLoggedIn,
    showToast,
}: handleDeleteJobProps) => {
    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/jobs/${job.id}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 401) {
            showToast({
                label: 'Nutzersession ungültig. Bitte melde Dich erneut an.',
            })
            setIsLoggedIn(false)
            setItemInSessionStorage('isLoggedIn', false)
            navigate('/')
            return
        }

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
