import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useContext, useState } from 'react'
import Arbeitseinteilung from './pages/Arbeitseinteilung'
import Aufgaben from './pages/Aufgaben'
import Home from './pages/Home'
import Login from './pages/Login'
import Mitglieder from './pages/Mitglieder'
import Vorbereitung from './pages/Vorbereitung'
import ChatbotWidget from './components/chatbot/ChatbotWidget'
import Footer from './components/footer/Footer'
import Navigation from './components/navigation/Navigation'
import { ChatbotProvider } from './context/ChatbotContex'
import { IsLoggedInContext } from './context/IsLoggedInContext'
import { ToastProvider } from './context/ToastContext'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { getStoredLocalData } from './utils/getStoredLocalData'
import { setItemInLocalStorage } from './utils/setItemInLocalStorage'

const AppContent = () => {
    useDocumentTitle()

    const isLoggedInContext = useContext(IsLoggedInContext)
    if (!isLoggedInContext) {
        throw new Error('App must be used within a IsLoggedInContext.Provider')
    }
    const [isLoggedIn, _setIsLoggedIn] = isLoggedInContext

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-zinc-100 primary-text">
            <Navigation />
            <Routes>
                <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
                <Route
                    path="/arbeitseinteilung"
                    element={<Arbeitseinteilung />}
                />
                <Route path="/mitglieder" element={<Mitglieder />} />
                <Route path="/aufgaben" element={<Aufgaben />} />
                <Route path="/vorbereitung" element={<Vorbereitung />} />
            </Routes>
            <ChatbotWidget />
            <Footer />
        </div>
    )
}

const App = () => {
    const parsedLocalData = getStoredLocalData()

    const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(() => {
        const data = parsedLocalData?.isLoggedIn
        if (data && typeof data === 'boolean') {
            return data
        }
        setItemInLocalStorage('isLoggedIn', false)
        return false
    })

    return (
        <ToastProvider>
            <BrowserRouter>
                <IsLoggedInContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
                    <ChatbotProvider>
                        <AppContent />
                    </ChatbotProvider>
                </IsLoggedInContext.Provider>
            </BrowserRouter>
        </ToastProvider>
    )
}

export default App
