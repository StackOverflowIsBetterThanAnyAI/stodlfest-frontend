import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/navigation/Navigation'
import Footer from './components/footer/Footer'
import Home from './pages/Home'
import Vorbereitung from './pages/Vorbereitung'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { ToastProvider } from './context/ToastContext'

const AppContent = () => {
    useDocumentTitle()

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-b from-slate-900 to-slate-800 text-zinc-100">
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/arbeitseinteilung"
                    element={<h1>Arbeitseinteilung</h1>}
                />
                <Route
                    path="/mitglieder"
                    element={<h1>Mitglieder anlegen</h1>}
                />
                <Route path="/aufgaben" element={<h1>Aufgaben anlegen</h1>} />
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
