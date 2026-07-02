import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/navigation/Navigation'
import Footer from './components/footer/Footer'
import Home from './pages/Home'
import { useDocumentTitle } from './hooks/useDocumentTitle'

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
                <Route path="/todo" element={<h1>Todo</h1>} />
            </Routes>
            <Footer />
        </div>
    )
}

const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App
