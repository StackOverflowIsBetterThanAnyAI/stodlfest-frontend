import type { HeaderProps } from '../../types/types'

const HeaderMain = ({ label }: HeaderProps) => {
    return (
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold flex justify-center text-center items-center">
            {label}
        </h1>
    )
}

export default HeaderMain
