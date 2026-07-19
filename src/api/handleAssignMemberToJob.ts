import { SERVER_ADDRESS } from '../constants/constants'
import type { handleAssignMemberToJobProps, MemberProps } from '../types/types'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'

export const handleAssignMemberToJob = async ({
    allMembers,
    job,
    member,
    setAllMembers,
    setIsLoading,
    showToast,
    targetAction,
}: handleAssignMemberToJobProps) => {
    try {
        setIsLoading(true)

        const newJob = targetAction === 'assign' ? job.job : null
        const newJobValue = targetAction === 'assign' ? job.id : null

        const response = await fetch(
            `${SERVER_ADDRESS}/api/members/${member.id}/`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ job_id: newJobValue }),
            }
        )

        if (!response.ok) {
            showToast({
                label:
                    targetAction === 'assign'
                        ? 'Mitglied konnte der Aufgabe nicht hinzugefügt werden.'
                        : 'Mitglied konnte nicht von der Aufgabe entfernt werden.',
            })
            return
        }

        const updatedMembers = (
            allMembers
                ? allMembers.map((m) => {
                      if (m.id === member.id) {
                          return {
                              ...m,
                              job: newJob,
                          }
                      }
                      return m
                  })
                : []
        ) as MemberProps[]

        setAllMembers(updatedMembers)
        setItemInSessionStorage('allMembers', updatedMembers)
    } catch {
        showToast({
            label: 'Beim Aktualisieren der Aufgabe ist ein Fehler aufgetreten.',
        })
    } finally {
        setIsLoading(false)
    }
}
