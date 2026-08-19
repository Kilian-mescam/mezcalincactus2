import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import MentionsLegalesPage from './pages/MentionsLegalesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
