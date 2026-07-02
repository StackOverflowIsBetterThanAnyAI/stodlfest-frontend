import { Link } from 'react-router-dom'
import { useScreenWidth } from '../../hooks/useScreenWidth'
import { useState } from 'react'
import logo from './../../assets/stodlfest.png'

const Navigation = () => {
    const SCREEN_WIDTH = useScreenWidth()

    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)

    const toggleMenuExpanded = () => {
        setIsMenuExpanded((prev) => !prev)
    }

    return (
        <nav className="secondary-text border-b-zinc-200 border-b">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-2 md:py-4 text-md md:text-lg">
                <Link
                    to="/"
                    className="secondary-text-pseudo flex items-center gap-3 md:gap-4"
                    aria-label="Stodlfest Startseite"
                    title="Stodlfest Startseite"
                >
                    <img
                        src={logo}
                        width={48}
                        className="outline-2 outline-zinc-200 rounded-full w-8 md:w-12"
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
                                ? 'Close mobile navigation menu'
                                : 'Open mobile navigation menu'
                        }
                        title={
                            isMenuExpanded
                                ? 'Close mobile navigation menu'
                                : 'Open mobile navigation menu'
                        }
                        className="text-xl secondary-text-pseudo w-8 h-8 flex items-center justify-center"
                    >
                        {isMenuExpanded ? '✖' : '☰'}
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <Link
                            to="/arbeitseinteilung"
                            className="secondary-text-pseudo"
                        >
                            Arbeitseinteilung
                        </Link>
                        <Link
                            to="/mitglieder"
                            className="secondary-text-pseudo"
                        >
                            Mitglieder
                        </Link>
                        <Link to="/aufgaben" className="secondary-text-pseudo">
                            Aufgaben
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
                        className="secondary-text-pseudo"
                    >
                        Arbeitseinteilung
                    </Link>
                    <Link to="/mitglieder" className="secondary-text-pseudo">
                        Mitglieder
                    </Link>
                    <Link to="/aufgaben" className="secondary-text-pseudo">
                        Aufgaben
                    </Link>
                </nav>
            )}
        </nav>
    )
}

export default Navigation
