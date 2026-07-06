const Footer = () => {
    const date = new Date()
    const year = date.getFullYear()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === ' ') {
            e.preventDefault()
            window.open(
                'https://github.com/StackOverflowIsBetterThanAnyAI/stodlfest-frontend'
            )
        }
    }

    return (
        <footer className="primary-text mt-auto">
            <div className="flex flex-col mx-auto gap-y-2 w-full max-w-7xl text-pretty text-center text-xs md:text-sm p-4">
                <span>
                    Copyright &#169; {year} Michael Münzenhofer. Alle Rechte
                    vorbehalten.
                </span>
                <a
                    href="https://github.com/StackOverflowIsBetterThanAnyAI/stodlfest-frontend"
                    onKeyDown={(e) => handleKeyDown(e)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository (öffnet in einem neuen Tab)"
                    title="GitHub Repository (öffnet in einem neuen Tab)"
                    className="w-fit flex items-center gap-1 px-4 py-1 m-auto primary-text-pseudo"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        height={12}
                        fill="currentColor"
                        className="text-zinc-200"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                    </svg>
                    <span>GitHub Repository</span>
                </a>
            </div>
        </footer>
    )
}

export default Footer
