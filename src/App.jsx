import { useEffect, useRef } from 'react'
import { HashRouter, Link, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import { profile } from './data/portfolio'

const titles = {
  '/': `${profile.name} | ${profile.focus}`,
  '/about': `Sobre mí | ${profile.name}`,
  '/projects': `Proyectos | ${profile.name}`,
  '/contact': `Contacto | ${profile.name}`,
}

function RouteEffects() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)

  useEffect(() => {
    document.title = titles[pathname] ?? `Página no encontrada | ${profile.name}`
    if (previousPath.current !== pathname) {
      window.scrollTo(0, 0)
      document.getElementById('main-content')?.focus()
      previousPath.current = pathname
    }
  }, [pathname])

  return null
}

export default function App() {
  return (
    <HashRouter>
      <RouteEffects />
      <div className="app-shell">
        <button className="skip-link" type="button" onClick={() => document.getElementById('main-content')?.focus()}>Saltar al contenido</button>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<main id="main-content" tabIndex={-1} className="page content-page"><h1>Página no encontrada</h1><p>La dirección que buscas no existe.</p><Link to="/">Volver al inicio</Link></main>} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  )
}
