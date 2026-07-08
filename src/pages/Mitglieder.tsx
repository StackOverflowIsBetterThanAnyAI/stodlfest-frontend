import { useState } from 'react'
import FormNewMember from '../components/form/FormNewMember'
import HeaderMain from '../components/header/HeaderMain'
import { AllMembersContext } from '../context/AllMembersContext'
import { getStoredSessionData } from '../utils/getStoredSessionData'
import type { MemberProps } from '../types/types'

const Mitglieder = () => {
    const parsedSessionData = getStoredSessionData()

    const [allMembers, setAllMembers] = useState<MemberProps[]>(
        (parsedSessionData?.allMembers as MemberProps[]) || []
    )

    return (
        <main className="max-w-7xl w-full mx-auto items-center p-8 flex flex-col gap-8 xs:gap-16">
            <AllMembersContext.Provider value={[allMembers, setAllMembers]}>
                <HeaderMain label="Mitglieder" />
                <FormNewMember />
            </AllMembersContext.Provider>
        </main>
    )
}

export default Mitglieder
