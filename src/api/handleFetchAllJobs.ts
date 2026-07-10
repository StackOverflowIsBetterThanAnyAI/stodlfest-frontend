import { SERVER_ADDRESS } from '../constants/constants'
import type { handleFetchAllJobsProps, JobProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleFetchAllJobs = async ({
    setAllJobs,
    setIsLoading,
    showToast,
}: handleFetchAllJobsProps) => {
    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/jobs/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            showToast({
                label: 'Aufgaben konnten nicht geladen werden.',
            })
            return
        }

        const jobData: JobProps[] = await response.json()
        setAllJobs(jobData)
        setItemInSessionStorage('allJobs', jobData)
    } catch {
        showToast({
            label: 'Beim Laden der Aufgaben ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
