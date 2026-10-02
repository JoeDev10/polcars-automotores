import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Stock from './pages/Stock'
import AutoDetalle from './pages/AutoDetalle'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function ScrollArriba() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Layout() {
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] btn-light">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
      <ScrollArriba />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="stock" element={<Stock />} />
          <Route path="auto/:id" element={<AutoDetalle />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin" element={<Admin />} />
      </Routes>
    </>
  )
}
