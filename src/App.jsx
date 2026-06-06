import './App.css'
import Footer from './Components/Footer/Footer'
import './Components/Footer/Footer.css'
import Search from './Components/Search/Search'
import Home from './Components/Home/Home'
import Settings from './pages/Settings/Settings'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/settings" replace />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/settings" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App

