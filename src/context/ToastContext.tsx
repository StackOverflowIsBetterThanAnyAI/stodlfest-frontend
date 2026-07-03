import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react'
import Toast from '../components/toast/Toast'

export type ToastProps = {
    label: string
    isSuccess: boolean
}

type ToastContextType = {
    showToast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<ToastProps | null>(null)
    const [isVisible, setIsVisible] = useState<boolean>(false)

    const showToast = useCallback(({ label, isSuccess }: ToastProps) => {
        setToast({ label, isSuccess })
        setIsVisible(true)
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
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {isVisible && toast && (
                <Toast label={toast.label} isSuccess={toast.isSuccess} />
            )}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
