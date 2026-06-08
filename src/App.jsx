import './App.css'
import Footer from './Components/Footer/Footer'
import './Components/Footer/Footer.css'
import Search from './Components/Search/Search'
import Settings from './pages/Settings/Settings'
import Sales from './pages/Sales/Sales'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sales" replace />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/sales" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App

