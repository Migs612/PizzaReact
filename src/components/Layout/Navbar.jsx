// =============================================
// Navbar - Cápsula negra flotante centrada (wireframe)
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
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1440px] px-4 md:px-6">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="bg-pizza-black rounded-full px-6 md:px-8 py-3 flex items-center justify-between"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🍕</span>
          <span className="text-white font-bold text-lg tracking-wider">
            PIZZA<span className="text-pizza-red">REACT</span>
          </span>
        </Link>

        {/* Navigation Links - desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-300 hover:text-white text-xs font-semibold tracking-[0.2em] transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 md:gap-5">
          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative text-gray-300 hover:text-white transition-colors"
          >
            <i className="fas fa-shopping-cart text-lg" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-pizza-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* User */}
          {user ? (
            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
              <i className="fas fa-user text-lg" />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-gray-300 hover:text-white text-xs font-semibold tracking-[0.2em] transition-colors"
            >
              LOGIN
            </Link>
          )}

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-gray-300 hover:text-white transition-colors"
          >
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-lg`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-pizza-black rounded-2xl mt-2 px-6 py-4 flex flex-col gap-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="text-gray-300 hover:text-white text-sm font-semibold tracking-[0.15em] transition-colors py-1"
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
