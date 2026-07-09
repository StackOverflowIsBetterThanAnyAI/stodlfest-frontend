import { SERVER_ADDRESS } from '../constants/constants'
import type { handleAddNewJobProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleAddNewJob = async ({
    e,
    job,
    setAllJobs,
    setIsLoading,
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
    }

    try {
        setIsLoading(true)

        const response = await fetch(`${SERVER_ADDRESS}/api/jobs/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobData),
        })

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

        const newJob = await response.json()
        setAllJobs((prevJobs) => {
            const updatedJobs = [newJob, ...(prevJobs || [])]
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
