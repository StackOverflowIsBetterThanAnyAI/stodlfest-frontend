import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Arbeitseinteilung from './pages/Arbeitseinteilung'
import Aufgaben from './pages/Aufgaben'
import Home from './pages/Home'
import Mitglieder from './pages/Mitglieder'
import Vorbereitung from './pages/Vorbereitung'
import Footer from './components/footer/Footer'
import Navigation from './components/navigation/Navigation'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { ToastProvider } from './context/ToastContext'

const AppContent = () => {
    useDocumentTitle()

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-zinc-100 primary-text">
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/arbeitseinteilung"
                    element={<Arbeitseinteilung />}
                />
                <Route path="/mitglieder" element={<Mitglieder />} />
                <Route path="/aufgaben" element={<Aufgaben />} />
                <Route path="/vorbereitung" element={<Vorbereitung />} />
            </Routes>
            <Footer />
        </div>
    )
}

const App = () => {
    return (
        <ToastProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </ToastProvider>
    )
}

export default App
