import { useNavigate } from 'react-router-dom'

const FourOhFour = () => {
    const navigate = useNavigate()

    const handleRedirect = () => {
        navigate('/')
    }

    return (
        <main className="max-w-7xl w-full m-auto items-center text-center p-4 md:p-8 flex flex-col gap-4 xs:gap-8">
            <div className="text-7xl xs:text-9xl font-bold">404</div>
            <div className="text-lg xs:text-xl md:text-2xl lg:text-3xl">
                Diese Seite existiert nicht ...
            </div>
            <button
                className="outline-2 outline-zinc-500 text-sm xs:text-base lg:text-lg px-4 py-2 primary-text-pseudo-secondary"
                onClick={handleRedirect}
            >
                Zurück zur Startseite
            </button>
        </main>
    )
}

export default FourOhFour
