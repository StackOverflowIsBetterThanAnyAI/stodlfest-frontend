import { SERVER_ADDRESS } from '../constants/constants'
import type { handleAddNewJobProps, JobProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleAddNewJob = async ({
    accessToken,
    e,
    job,
    navigate,
    requiresLegalAge,
    setAllJobs,
    setIsLoading,
    setIsLoggedIn,
    setIsSubmitDisabled,
    setJob,
    setWorkers,
    showToast,
    workers,
}: handleAddNewJobProps) => {
    e.preventDefault()

    const jobData = {
        job,
        workers,
        requires_legal_age: requiresLegalAge,
    }

    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/jobs/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobData),
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
            const errorData = await response.json()
            const error = errorData.job.join(' ')
            showToast({
                label: error,
            })
            return
        }

        setJob('')
        setWorkers(1)
        setIsSubmitDisabled(true)
        setItemInSessionStorage('jobAdd', '')
        setItemInSessionStorage('workersAdd', 1)
        setItemInSessionStorage('requiresLegalAgeAdd', 'doesNotRequireLegalAge')

        const newJob: JobProps = await response.json()
        setAllJobs((prevJobs) => {
            const updatedJobs = [newJob, ...(prevJobs || [])]
            updatedJobs.sort((a, b) => {
                const jobCompare = a.job.localeCompare(b.job, 'de')
                return jobCompare
            })
            setItemInSessionStorage('allJobs', updatedJobs)
            return updatedJobs
        })
    } catch {
        showToast({
            label: 'Beim Hinzufügen dieser Arbeit ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
