import { Link } from 'react-router-dom'
import { useScreenWidth } from '../../hooks/useScreenWidth'
import { useContext, useState } from 'react'
import logo from './../../assets/stodlfest.png'
import { IsLoggedInContext } from '../../context/IsLoggedInContext'

const Navigation = () => {
    const SCREEN_WIDTH = useScreenWidth()

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error(
            'Navigation must be used within a IsLoggedInContext.Provider'
        )
    }
    const [isLoggedIn, _setIsLoggedIn] = isLoggedInContext

    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)

    const toggleMenuExpanded = () => {
        setIsMenuExpanded((prev) => !prev)
    }

    return (
        <nav className="primary-text border-b-zinc-200 border-b">
            {isLoggedIn ? (
                <>
                    <div className="flex justify-between items-center max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-2 md:py-4 text-md md:text-lg">
                        <Link
                            to="/"
                            className="primary-text-pseudo-secondary flex items-center gap-3 md:gap-4"
                            aria-label="Stodlfest Startseite"
                            title="Stodlfest Startseite"
                        >
                            <img
                                src={logo}
                                width={48}
                                className="outline-2 outline-zinc-200 rounded-full w-8 md:w-10 lg:w-12"
                                alt=""
                            />
                            Stodlfest
                        </Link>
                        {SCREEN_WIDTH === 'MOBILE' ? (
                            <button
                                onClick={toggleMenuExpanded}
                                aria-controls="mobile-navigation"
                                aria-expanded={isMenuExpanded}
                                aria-label={
                                    isMenuExpanded
                                        ? 'Das mobile Navigationsmenü schließen'
                                        : 'Das mobile Navigationsmenü öffnen'
                                }
                                title={
                                    isMenuExpanded
                                        ? 'Das mobile Navigationsmenü schließen'
                                        : 'Das mobile Navigationsmenü öffnen'
                                }
                                className="text-xl primary-text-pseudo-secondary w-8 h-8 flex items-center justify-center"
                            >
                                {isMenuExpanded ? '✖' : '☰'}
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    to="/arbeitseinteilung"
                                    className="primary-text-pseudo-secondary"
                                >
                                    Arbeitseinteilung
                                </Link>
                                <Link
                                    to="/aufgaben"
                                    className="primary-text-pseudo-secondary"
                                >
                                    Aufgaben
                                </Link>
                                <Link
                                    to="/mitglieder"
                                    className="primary-text-pseudo-secondary"
                                >
                                    Mitglieder
                                </Link>
                                <Link
                                    to="/vorbereitung"
                                    className="primary-text-pseudo-secondary"
                                >
                                    Vorbereitung
                                </Link>
                            </div>
                        )}
                    </div>
                    {SCREEN_WIDTH === 'MOBILE' && isMenuExpanded && (
                        <nav
                            className="flex gap-2 px-2 sm:px-4 md:px-8 py-2 justify-evenly flex-wrap border-b-zinc-200 border-t"
                            id="mobile-navigation"
                        >
                            <Link
                                to="/arbeitseinteilung"
                                className="primary-text-pseudo-secondary"
                            >
                                Arbeitseinteilung
                            </Link>
                            <Link
                                to="/aufgaben"
                                className="primary-text-pseudo-secondary"
                            >
                                Aufgaben
                            </Link>
                            <Link
                                to="/mitglieder"
                                className="primary-text-pseudo-secondary"
                            >
                                Mitglieder
                            </Link>
                            <Link
                                to="/vorbereitung"
                                className="primary-text-pseudo-secondary"
                            >
                                Vorbereitung
                            </Link>
                        </nav>
                    )}
                </>
            ) : (
                <div className="flex justify-between items-center max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-2 md:py-4 text-md md:text-lg">
                    <Link
                        to="/"
                        className="primary-text-pseudo-secondary flex items-center gap-3 md:gap-4"
                        aria-label="Stodlfest Startseite"
                        title="Stodlfest Startseite"
                    >
                        <img
                            src={logo}
                            width={48}
                            className="outline-2 outline-zinc-200 rounded-full w-8 md:w-10 lg:w-12"
                            alt=""
                        />
                        Stodlfest
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default Navigation
