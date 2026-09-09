import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home'
import Artisti from './pages/Artisti'
import Mostre from './pages/Mostre'
import MostraDettaglio from './pages/MostraDettaglio'
import Contatti from './pages/Contatti'
import Info from './pages/Info'

function ScrollToTop() {
  const { key } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [key])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artisti" element={<Artisti />} />
          <Route path="/mostre" element={<Mostre />} />
          <Route path="/mostre/:id" element={<MostraDettaglio />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
