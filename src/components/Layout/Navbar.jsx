// =============================================
// Navbar – Cápsula brutaliste flotante
// =============================================
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { totalItems, toggleCart } = useCart()
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { name: 'OFERTAS', path: '/' },
    { name: 'MENÚS', path: '/' },
    { name: 'PIZZAS', path: '/?category=Pizza' },
    { name: 'BEBIDAS', path: '/?category=Bebida' },
    { name: 'POSTRES', path: '/?category=Postre' },
  ]

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1440px] px-4 md:px-6 mt-4">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="bg-black rounded-full mx-auto px-8 py-4 flex items-center justify-between"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🍕</span>
          <span className="text-white font-bold text-lg tracking-wider">
            PIZZA<span className="text-pizza-red">REACT</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-white/70 hover:text-white text-xs font-semibold tracking-[0.2em] uppercase transition-opacity duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <button
            onClick={toggleCart}
            className="relative text-white/70 hover:text-white transition-opacity"
          >
            <i className="fas fa-shopping-cart text-lg" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-pizza-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <Link to="/profile" className="text-white/70 hover:text-white transition-opacity">
              <i className="fas fa-user text-lg" />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-white/70 hover:text-white text-xs font-semibold tracking-[0.2em] uppercase transition-opacity"
            >
              LOGIN
            </Link>
          )}

          {/* Hamburger mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white/70 hover:text-white transition-opacity"
          >
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-lg`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-black rounded-2xl mt-2 px-6 py-4 flex flex-col gap-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="text-white/70 hover:text-white text-sm font-semibold tracking-[0.15em] uppercase transition-opacity py-1"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
