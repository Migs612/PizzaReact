// =============================================
// App.jsx - Router principal con animaciones
// =============================================
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Layout/Navbar'
import CartDrawer from './components/Layout/CartDrawer'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import Auth from './pages/Auth'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

// Wrapper de animación para transiciones entre páginas
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar global – capsule flotante */}
      <Navbar />

      {/* Cart Drawer (siempre disponible) */}
      <CartDrawer />

      {/* Páginas con animación */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
            <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
            <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer en todas las páginas sin excepción */}
      <Footer />
    </div>
  )
}
