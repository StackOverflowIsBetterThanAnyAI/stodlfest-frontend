import type { HeaderProps } from '../../types/types'

const Header = ({ label }: HeaderProps) => {
    return (
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold flex justify-center text-center items-center">
            {label}
        </h2>
    )
}

export default Header
