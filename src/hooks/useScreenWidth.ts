import { useEffect, useState } from 'react'
import { getStoredSessionData } from '../utils/getStoredSessionData'
import { setItemInSessionStorage } from '../utils/setItemInSessionStorage'
import type { useScreenWidthType } from '../types/types'

export const useScreenWidth = (): useScreenWidthType => {
    const parsedSessionData = getStoredSessionData()

    const [screenWidth, setScreenWidth] = useState<useScreenWidthType>(
        (parsedSessionData?.screenWidth as useScreenWidthType) || 'MOBILE'
    )

    useEffect(() => {
        const handleScreenWidth = () => {
            if (window.innerWidth < 640) {
                setScreenWidth('MOBILE')
                setItemInSessionStorage('screenWidth', 'MOBILE')
            } else if (window.innerWidth < 1024) {
                setScreenWidth('TABLET')
                setItemInSessionStorage('screenWidth', 'TABLET')
            } else {
                setScreenWidth('DESKTOP')
                setItemInSessionStorage('screenWidth', 'DESKTOP')
            }
        }
        window.addEventListener('resize', handleScreenWidth)
        handleScreenWidth()

        return () => {
            window.removeEventListener('resize', handleScreenWidth)
        }
    }, [])

    return screenWidth
}
