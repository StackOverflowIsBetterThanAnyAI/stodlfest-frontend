import { useEffect, useState } from 'react'
import type { ToastProps } from '../../types/types'
import { useToast } from '../../context/ToastContext'

const Toast = ({ isSuccess, label }: ToastProps) => {
    const { hideToast } = useToast()
    const [isTriggered, setIsTriggered] = useState<boolean>(true)

    const opacity = isTriggered ? 'opacity-90' : 'opacity-0'
    const positionX = isTriggered ? 'left-2 min-[280px]:left-6' : '-left-64'
    const theme = isSuccess
        ? 'bg-green-500 text-stone-900/95'
        : 'bg-red-400 text-stone-950'

    useEffect(() => {
        const animationTimeout = setTimeout(() => {
            setIsTriggered(false)
        }, 3000)

        return () => clearTimeout(animationTimeout)
    }, [])

    const handleCloseToast = () => {
        setIsTriggered(false)
        hideToast()
    }

    return (
        <div
            className={`text-normal fixed flex gap-2 bottom-6 ${positionX} rounded-sm
            outline-1 outline-zinc-50 p-2 transition-all duration-700 ${opacity} ${theme}`}
            role="status"
            aria-live="polite"
        >
            {label}
            <button
                className="flex items-center justify-center rounded-full outline-1 outline-stone-900 text-xs h-4 w-4 bg-zinc-50/80"
                onClick={handleCloseToast}
                aria-label="Nachricht schließen"
                title="Nachricht schließen"
            >
                🗙
            </button>
        </div>
    )
}

export default Toast
