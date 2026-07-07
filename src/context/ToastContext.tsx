import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react'
import Toast from '../components/toast/Toast'
import type { ToastContextType, ToastProps } from '../types/types'

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<ToastProps | null>(null)
    const [isVisible, setIsVisible] = useState<boolean>(false)

    const showToast = useCallback(({ label }: ToastProps) => {
        setToast({ label })
        setIsVisible(true)
    }, [])

    const hideToast = useCallback(() => {
        setIsVisible(false)
    }, [])

    useEffect(() => {
        if (isVisible) {
            const timeout = setTimeout(() => {
                setIsVisible(false)
            }, 3750)
            return () => clearTimeout(timeout)
        }
    }, [isVisible])

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            {isVisible && toast && (
                <Toast key={toast.label} label={toast.label} />
            )}
        </ToastContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
