import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { setDocumentTitle } from '../utils/setDocumentTitle'

export const useDocumentTitle = () => {
    const location = useLocation()

    useEffect(() => {
        document.title = setDocumentTitle()
    }, [location])
}
