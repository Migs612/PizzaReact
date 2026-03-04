// =============================================
// App.jsx - Layout global brutaliste
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

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto w-full">
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
