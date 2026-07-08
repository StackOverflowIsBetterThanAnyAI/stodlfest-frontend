import { useContext, useState, type ChangeEvent } from 'react'
import FormRadioButton from './FormRadioButton'
import Header from '../header/Header'
import ListButton from '../list/ListButton'
import { useToast } from '../../context/ToastContext'
import { AllMembersContext } from '../../context/AllMembersContext'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import type { AgeType } from '../../types/types'
import { handleAddNewMember } from '../../api/handleAddNewMember'

const FormNewMember = () => {
    const parsedSessionData = getStoredSessionData()
    const { showToast } = useToast()

    const allMembersContext = useContext(AllMembersContext)
    if (!allMembersContext) {
        throw new Error(
            'FormNewMember must be used within a AllMembersContext.Provider'
        )
    }
    const [_allMembers, setAllMembers] = allMembersContext

    const NAME_LENGTH = 63

    const [age, setAge] = useState<AgeType>(() => {
        const data = parsedSessionData?.ageAdd
        if ((data?.length && data === 'underage') || data === 'ofLegalAge') {
            return data
        }
        setItemInSessionStorage('ageAdd', 'underage')
        return 'underage'
    })
    const [name, setName] = useState<string>(() => {
        const data = parsedSessionData?.nameAdd
        if (data?.length && typeof data === 'string') {
            const slicedData = data.slice(0, NAME_LENGTH)
            setItemInSessionStorage('nameAdd', slicedData)
            return slicedData
        }
        setItemInSessionStorage('nameAdd', '')
        return ''
    })
    const [surname, setSurname] = useState<string>(() => {
        const data = parsedSessionData?.surnameAdd
        if (data?.length && typeof data === 'string') {
            const slicedData = data.slice(0, NAME_LENGTH)
            setItemInSessionStorage('surnameAdd', slicedData)
            return slicedData
        }
        setItemInSessionStorage('surnameAdd', '')
        return ''
    })

    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(
        !parsedSessionData?.surnameAdd?.length ||
            !parsedSessionData?.surnameAdd?.length
    )
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleChangeAge = (e: ChangeEvent<HTMLInputElement>) => {
        setAge(e.target.value as AgeType)
        setItemInSessionStorage('ageAdd', e.target.value)
    }
    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setName(input)
        setItemInSessionStorage('nameAdd', input)
        setIsSubmitDisabled(!input.length || !surname.length)
    }
    const handleChangeSurname = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setSurname(input)
        setItemInSessionStorage('surnameAdd', input)
        setIsSubmitDisabled(!input.length || !name.length)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        handleAddNewMember({
            e,
            age,
            name,
            setAge,
            setAllMembers,
            setIsLoading,
            setIsSubmitDisabled,
            setName,
            setSurname,
            showToast,
            surname,
        })
    }

    const inputClass =
        'w-full outline outline-zinc-500 rounded-lg px-2 py-1 bg-slate-800 hover:bg-slate-700/50 text-sm md:text-base'

    return (
        <form
            className="flex flex-col gap-6 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full"
            onSubmit={handleSubmit}
        >
            <Header label="Neues Mitglied anlegen" />
            <div className="flex flex-wrap gap-2 items-center">
                <label
                    htmlFor="nameAdd"
                    className="font-bold text-base md:text-lg"
                >
                    Vorname:
                </label>
                <input
                    type="text"
                    placeholder="Vorname"
                    id="nameAdd"
                    className={`min-w-32 ${inputClass}`}
                    onChange={handleChangeName}
                    value={name}
                    maxLength={NAME_LENGTH}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="surnameAdd"
                    className="font-bold text-base md:text-lg"
                >
                    Nachname:
                </label>
                <input
                    type="text"
                    placeholder="Nachname"
                    id="surnameAdd"
                    className={`min-w-32 ${inputClass}`}
                    onChange={handleChangeSurname}
                    value={surname}
                    maxLength={NAME_LENGTH}
                    required
                />
            </div>
            <fieldset>
                <legend className="font-bold text-base md:text-lg">
                    Alter:
                </legend>
                <div className="flex w-full flex-wrap gap-x-4 gap-y-1 items-center">
                    <FormRadioButton
                        id="underageAdd"
                        label="Minderjährig"
                        value="underage"
                        currentValue={age}
                        onChange={handleChangeAge}
                    />
                    <FormRadioButton
                        id="ofLegalAgeAdd"
                        label="Volljährig"
                        value="ofLegalAge"
                        currentValue={age}
                        onChange={handleChangeAge}
                    />
                </div>
            </fieldset>
            <ListButton
                handleClick={() => {}}
                isLoading={isLoading}
                isDisabled={isSubmitDisabled}
                label="Mitglied anlegen"
                isSubmit
                type="form"
            />
        </form>
    )
}

export default FormNewMember
