import { useContext, useMemo, useState } from 'react'
import FormSwitch from './../components/form/FormSwitch'
import HeaderMain from '../components/header/HeaderMain'
import ListButton from '../components/list/ListButton'
import { handleLogin } from '../api/handleLogin'
import { handleSignUp } from '../api/handleSignUp'
import { IsLoggedInContext } from '../context/IsLoggedInContext'
import { useToast } from '../context/ToastContext'
import { getStoredSessionData } from '../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'
// import { useSessionExpired } from '../../hooks/useSessionExpired'

const Login = () => {
    const parsedSessionData = getStoredSessionData()
    const { showToast } = useToast()

    const USERNAME_MINLENGTH = 5
    const USERNAME_MAXLENGTH = 20
    const PASSWORD_MINLENGTH = 8
    const PASSWORD_MAXLENGTH = 25

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error(
            'Login must be used within a IsLoggedInContext.Provider'
        )
    }
    const [_isLoggedIn, setIsLoggedIn] = isLoggedInContext

    const [userName, setUserName] = useState<string>(() => {
        const data = parsedSessionData?.username
        if (data?.length && typeof data === 'string') {
            const slicedData = data.slice(0, USERNAME_MAXLENGTH)
            setItemInSessionStorage('username', slicedData)
            return slicedData
        }
        setItemInSessionStorage('username', '')
        return ''
    })
    const [isSigningUp, setIsSigningUp] = useState<boolean>(() => {
        const data = parsedSessionData?.isSigningUp
        if (data && typeof data === 'boolean') {
            return data
        }
        setItemInSessionStorage('isSigningUp', false)
        return false
    })

    const [password, setPassword] = useState<string>('')
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [isConfirmPasswordDisabled, setIsConfirmPasswordDisabled] =
        useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true)

    const userNamePattern = useMemo<RegExp>(() => /^[a-z0-9]{5,20}$/i, [])
    const passwordPattern = useMemo<RegExp>(() => /^[^\s]{8,25}$/, [])

    // useSessionExpired({ location, navigate, showToast })

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isSubmitDisabled) {
            e.preventDefault()
            handleClickAuthenticate()
        }
    }

    const handleSwitch = () => {
        const updatedIsSignUp = !isSigningUp
        setIsSigningUp(updatedIsSignUp)
        setConfirmPassword('')
        setItemInSessionStorage('isSigningUp', updatedIsSignUp)

        if (
            userNamePattern.test(userName || '') &&
            passwordPattern.test(password || '')
        ) {
            setIsSubmitDisabled(updatedIsSignUp)
        } else {
            setIsSubmitDisabled(true)
        }
    }

    const handleClickAuthenticate = async () => {
        setIsLoading(true)
        setIsSubmitDisabled(true)

        if (isSigningUp) {
            handleSignUp({
                password,
                setIsLoading,
                setIsLoggedIn,
                setIsSubmitDisabled,
                showToast,
                userName,
            })
        } else {
            handleLogin({
                password,
                setIsLoading,
                setIsLoggedIn,
                setIsSubmitDisabled,
                showToast,
                userName,
            })
        }
    }

    const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value?.trim() || ''
        setUserName(value)
        setItemInSessionStorage('username', value)

        if (
            userNamePattern.test(value) &&
            passwordPattern.test(password || '')
        ) {
            if (isSigningUp) {
                setIsSubmitDisabled(password !== confirmPassword)
            } else {
                setIsSubmitDisabled(false)
            }
        } else {
            setIsSubmitDisabled(true)
        }
    }

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value?.trim() || ''
        setPassword(value)
        if (confirmPassword?.length) {
            setConfirmPassword('')
        }

        if (passwordPattern.test(value)) {
            setIsConfirmPasswordDisabled(false)
        } else {
            setIsConfirmPasswordDisabled(true)
            return
        }

        if (
            userNamePattern.test(userName || '') &&
            passwordPattern.test(value)
        ) {
            if (isSigningUp) {
                setIsSubmitDisabled(password !== confirmPassword)
            } else {
                setIsSubmitDisabled(false)
            }
        } else {
            setIsSubmitDisabled(true)
        }
    }

    const handleChangeConfirmPassword = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value?.trim() || ''
        setConfirmPassword(value)

        if (
            userNamePattern.test(userName || '') &&
            passwordPattern.test(password || '')
        ) {
            if (isSigningUp) {
                setIsSubmitDisabled(password !== value)
            } else {
                setIsSubmitDisabled(false)
            }
        } else {
            setIsSubmitDisabled(true)
        }
    }

    const handleTogglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleClickAuthenticate()
    }

    return (
        <main className="max-w-7xl w-full mx-auto items-center p-4 md:p-8 flex flex-col gap-6 xs:gap-8">
            <HeaderMain label={isSigningUp ? 'Signup' : 'Login'} />
            <form
                className="flex flex-col gap-6 md:gap-8 outline-2 outline-zinc-200 rounded-lg p-4 max-w-3xl w-full bg-slate-900"
                autoComplete="on"
                onSubmit={handleSubmit}
            >
                <FormSwitch
                    isSigningUp={isSigningUp}
                    handleClick={handleSwitch}
                />
                <div className="flex flex-wrap gap-2 items-end">
                    <label
                        htmlFor="username"
                        className="font-bold text-base md:text-lg"
                    >
                        Benutzername:
                    </label>
                    <em
                        className="text-xs md:text-sm pb-1 text-zinc-300"
                        aria-hidden="true"
                    >
                        * erforderlich
                    </em>
                    <input
                        type="text"
                        placeholder="Max Mustermann"
                        id="username"
                        className="min-w-32 w-full outline outline-zinc-500 rounded-lg px-2 py-1 hover:bg-slate-700/40 text-sm md:text-base"
                        onChange={handleChangeUserName}
                        onKeyDown={handleKeyDown}
                        autoComplete="username"
                        value={userName}
                        maxLength={USERNAME_MAXLENGTH}
                        minLength={USERNAME_MINLENGTH}
                        required
                        aria-describedby={
                            isSigningUp ? 'usernameHelp' : undefined
                        }
                    />
                    {isSigningUp && (
                        <div id="usernameHelp" className="text-xs md:text-sm">
                            {`Wähle einen Benutzernamen, der zwischen ${USERNAME_MINLENGTH} und ${USERNAME_MAXLENGTH} Zeichen lang ist und nur lateinische Buchstaben oder Zahlen enthält.`}
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                    <label
                        htmlFor="password"
                        className="font-bold text-base md:text-lg"
                    >
                        Passwort:
                    </label>
                    <em
                        className="text-xs md:text-sm pb-1 text-zinc-300"
                        aria-hidden="true"
                    >
                        * erforderlich
                    </em>
                    <div className="min-w-32 w-full flex gap-2 items-center outline outline-zinc-500 rounded-lg pr-2">
                        <input
                            type={`${isPasswordVisible ? 'text' : 'password'}`}
                            placeholder={`${isPasswordVisible ? 'Passwort' : '••••••••••••••••'}`}
                            id="password"
                            className="w-full rounded-md px-2 py-1 hover:bg-slate-700/40 text-sm md:text-base"
                            onChange={handleChangePassword}
                            onKeyDown={handleKeyDown}
                            autoComplete={`${
                                isSigningUp ? 'new' : 'current'
                            }-password`}
                            value={password}
                            maxLength={PASSWORD_MAXLENGTH}
                            minLength={PASSWORD_MINLENGTH}
                            required
                            aria-describedby={
                                isSigningUp ? 'passwordHelp' : undefined
                            }
                        />
                        <label
                            htmlFor="showpassword"
                            className="text-sm md:text-base sr-only"
                        >
                            {isPasswordVisible
                                ? 'Passwort verbergen.'
                                : 'Passwort anzeigen.'}
                        </label>
                        <input
                            id="showpassword"
                            className="outline outline-stone-500 disabled:outline-0"
                            aria-checked={isPasswordVisible}
                            aria-label={
                                isPasswordVisible
                                    ? 'Passwort verbergen.'
                                    : 'Passwort anzeigen.'
                            }
                            checked={isPasswordVisible}
                            onChange={handleTogglePasswordVisibility}
                            title={
                                isPasswordVisible
                                    ? 'Passwort verbergen.'
                                    : 'Passwort anzeigen.'
                            }
                            type="checkbox"
                        />
                    </div>
                    {isSigningUp && (
                        <div id="passwordHelp" className="text-xs md:text-sm">
                            {`Wähle ein Passwort, das zwischen ${PASSWORD_MINLENGTH} und ${PASSWORD_MAXLENGTH} Zeichen lang ist.`}
                        </div>
                    )}
                </div>
                {isSigningUp && (
                    <div className="flex flex-wrap gap-2 items-end">
                        <label
                            htmlFor="confirmPassword"
                            className="font-bold text-base md:text-lg"
                        >
                            Passwort bestätigen:
                        </label>
                        <em
                            className="text-xs md:text-sm pb-1 text-zinc-300"
                            aria-hidden="true"
                        >
                            * erforderlich
                        </em>
                        <div className="min-w-32 w-full flex gap-2 items-center outline outline-zinc-500 rounded-lg pr-2">
                            <input
                                type={`${isPasswordVisible ? 'text' : 'password'}`}
                                placeholder={`${isPasswordVisible ? 'Passwort' : '••••••••••••••••'}`}
                                id="confirmPassword"
                                className="w-full rounded-md px-2 py-1 not-disabled:hover:bg-slate-700/40 text-sm md:text-base"
                                onChange={handleChangeConfirmPassword}
                                onKeyDown={handleKeyDown}
                                autoComplete="current-password"
                                disabled={isConfirmPasswordDisabled}
                                value={confirmPassword}
                                maxLength={PASSWORD_MAXLENGTH}
                                minLength={PASSWORD_MINLENGTH}
                                required
                            />
                            <label
                                htmlFor="showpassword"
                                className="text-sm md:text-base sr-only"
                            >
                                {isPasswordVisible
                                    ? 'Passwort verbergen.'
                                    : 'Passwort anzeigen.'}
                            </label>
                            <input
                                id="showpassword"
                                className="outline outline-stone-500 disabled:outline-0"
                                aria-checked={isPasswordVisible}
                                aria-label={
                                    isPasswordVisible
                                        ? 'Passwort verbergen.'
                                        : 'Passwort anzeigen.'
                                }
                                checked={isPasswordVisible}
                                disabled={isConfirmPasswordDisabled}
                                onChange={handleTogglePasswordVisibility}
                                title={`${isSubmitDisabled ? 'Deaktiviert. ' : ''}${
                                    isPasswordVisible
                                        ? 'Passwort verbergen.'
                                        : 'Passwort anzeigen.'
                                }`}
                                type="checkbox"
                            />
                        </div>
                    </div>
                )}
                <ListButton
                    handleClick={() => {}}
                    isLoading={isLoading}
                    isDisabled={isSubmitDisabled}
                    label={isSigningUp ? 'Signup' : 'Login'}
                    isSubmit
                    type="form"
                />
            </form>
        </main>
    )
}

export default Login
