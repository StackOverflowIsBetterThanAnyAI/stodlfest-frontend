import type { FormSwitchProps } from '../../types/types'

const FormSwitch = ({ isSigningUp, handleClick }: FormSwitchProps) => {
    const loginStyle = isSigningUp
        ? 'bg-slate-800/40 hover:bg-slate-600/40 active:bg-indigo-700'
        : 'bg-indigo-800'

    const signupStyle = isSigningUp
        ? 'bg-indigo-800'
        : 'bg-slate-800/40 hover:bg-slate-600/40 active:bg-indigo-700'

    return (
        <div className="flex justify-center text-normal">
            <button
                aria-pressed={isSigningUp}
                className="flex outline-zinc-500 outline-2 rounded-lg"
                onClick={handleClick}
                type="button"
            >
                <span
                    className={`${loginStyle} w-18 md:w-20 rounded-l-lg transition duration-500 ease-in-out pl-4 pr-2 py-1`}
                >
                    Login
                </span>
                <span
                    className={`${signupStyle} w-18 md:w-20 rounded-r-lg transition duration-500 ease-in-out pl-2 pr-4 py-1`}
                >
                    Signup
                </span>
            </button>
        </div>
    )
}

export default FormSwitch
