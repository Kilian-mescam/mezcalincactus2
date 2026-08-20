import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import MentionsLegalesPage from './pages/MentionsLegalesPage'
import PsychedelicOverlay from './components/PsychedelicOverlay'
import { PsychedelicModeProvider } from './context/PsychedelicModeContext'

function App() {
  return (
    <PsychedelicModeProvider>
      <BrowserRouter>
        <PsychedelicOverlay />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        </Routes>
      </BrowserRouter>
    </PsychedelicModeProvider>
  )
}

export default App
