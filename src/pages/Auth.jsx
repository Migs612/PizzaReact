// =============================================
// Auth Page - Login / Register – panel deslizante con "O" central
// =============================================
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    let result
    if (isLogin) {
      result = await login(formData.email, formData.password)
    } else {
      if (!formData.name.trim()) {
        setError('El nombre es obligatorio')
        setLoading(false)
        return
      }
      result = await register(formData.name, formData.email, formData.password)
    }

    setLoading(false)
    if (result.success) {
      navigate('/profile')
    } else {
      setError(result.message || 'Error en la autenticación')
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData({ name: '', email: '', password: '' })
  }

  /* ---- Formulario reutilizable ---- */
  const FormFields = ({ mode }) => (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs">
      {mode === 'register' && (
        <div className="relative">
          <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text" name="name" value={formData.name} onChange={handleChange}
            placeholder="Nombre completo"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pizza-red focus:border-transparent outline-none"
          />
        </div>
      )}
      <div className="relative">
        <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="email" name="email" value={formData.email} onChange={handleChange}
          placeholder="Email" required
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pizza-red focus:border-transparent outline-none"
        />
      </div>
      <div className="relative">
        <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="password" name="password" value={formData.password} onChange={handleChange}
          placeholder="Contraseña" required
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pizza-red focus:border-transparent outline-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <i className="fas fa-exclamation-circle" /> {error}
        </p>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        type="submit" disabled={loading}
        className="w-full bg-pizza-red hover:bg-pizza-red-dark text-white font-bold py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
      >
        {loading
          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          : mode === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'
        }
      </motion.button>

      {/* Demo credentials */}
      <div className="text-[10px] text-gray-400 text-center pt-1 space-y-0.5">
        <p>Demo: admin@adminpizza.es / admin123</p>
        <p>User: juan@email.com / user123</p>
      </div>
    </form>
  )

  return (
    <div className="min-h-[920px] bg-white flex items-center justify-center pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[860px] bg-white rounded-3xl overflow-hidden relative border border-gray-200"
        style={{ height: 480 }}
      >
        {/* ---- Contenedor de dos columnas fijas ---- */}
        <div className="flex h-full relative">

          {/* Columna izquierda */}
          <div className="w-1/2 flex flex-col items-center justify-center p-10">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.35 }}
                  className="flex flex-col items-center"
                >
                  <h2 className="text-2xl font-black text-black mb-1">Iniciar Sesión</h2>
                  <p className="text-gray-400 text-xs mb-6">Accede a tu cuenta</p>
                  <FormFields mode="login" />
                </motion.div>
              ) : (
                <motion.div
                  key="register-cta"
                  initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.35 }}
                  className="flex flex-col items-center text-center"
                >
                  <span className="text-5xl mb-4">🍕</span>
                  <h2 className="text-2xl font-black text-black mb-2">¿Ya tienes cuenta?</h2>
                  <p className="text-gray-400 text-sm mb-6 max-w-[220px] leading-relaxed">
                    Inicia sesión para hacer pedidos y acumular puntos.
                  </p>
                  <button
                    onClick={toggleMode}
                    className="border-2 border-pizza-red text-pizza-red font-bold py-2 px-8 rounded-full hover:bg-pizza-red hover:text-white transition-all text-sm"
                  >
                    INICIAR SESIÓN
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---- Separador central con "O" ---- */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex items-center z-20">
            <div className="relative w-px h-full bg-gray-200">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs">
                O
              </span>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="w-1/2 flex flex-col items-center justify-center p-10">
            <AnimatePresence mode="wait">
              {!isLogin ? (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}
                  className="flex flex-col items-center"
                >
                  <h2 className="text-2xl font-black text-black mb-1">Crear Cuenta</h2>
                  <p className="text-gray-400 text-xs mb-6">Regístrate gratis</p>
                  <FormFields mode="register" />
                </motion.div>
              ) : (
                <motion.div
                  key="login-cta"
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}
                  className="flex flex-col items-center text-center"
                >
                  <span className="text-5xl mb-4">🍕</span>
                  <h2 className="text-2xl font-black text-black mb-2">¡Únete a nosotros!</h2>
                  <p className="text-gray-400 text-sm mb-6 max-w-[220px] leading-relaxed">
                    Crea tu cuenta y empieza a disfrutar de la mejor pizza.
                  </p>
                  <button
                    onClick={toggleMode}
                    className="border-2 border-pizza-red text-pizza-red font-bold py-2 px-8 rounded-full hover:bg-pizza-red hover:text-white transition-all text-sm"
                  >
                    CREAR CUENTA
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
