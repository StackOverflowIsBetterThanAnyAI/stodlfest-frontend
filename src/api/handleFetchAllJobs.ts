import { SERVER_ADDRESS } from '../constants/constants'
import type { handleFetchAllJobsProps, JobProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleFetchAllJobs = async ({
    accessToken,
    navigate,
    setAllJobs,
    setIsLoading,
    setIsLoggedIn,
    showToast,
}: handleFetchAllJobsProps) => {
    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/jobs/`, {
            method: 'GET',
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
