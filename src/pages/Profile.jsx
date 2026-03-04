// =============================================
// Profile – Brutaliste: 4+8 col split (white / red)
// =============================================
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../hooks/useOrders'

const STATUS_STEPS = ['Pendiente', 'Preparando', 'En camino', 'Entregado']

const SIDE_NAV = [
  { icon: 'fa-receipt', label: 'Mis pedidos' },
  { icon: 'fa-undo', label: 'Devoluciones' },
  { icon: 'fa-map-marker-alt', label: 'Direcciones' },
  { icon: 'fa-credit-card', label: 'Métodos de pago' },
  { icon: 'fa-cog', label: 'Configuración' },
]

export default function Profile() {
  const { user, isAdmin, logout } = useAuth()
  const { orders, loading } = useOrders()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/auth')
  }, [user, navigate])

  if (!user) return null

  const activeOrder = orders.find(o => o.status !== 'Entregado')
  const activeStepIdx = activeOrder ? STATUS_STEPS.indexOf(activeOrder.status) : -1

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-0">
      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">

          {/* ========== LEFT — 4 cols, white ========== */}
          <div className="md:col-span-4 bg-white p-8 lg:p-10 border-r border-gray-200">
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-black text-black">
                Hola {user.name?.split(' ')[0] || 'Juan'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            </motion.div>

            {/* Points */}
            <div className="mb-8">
              <div className="text-5xl font-black text-black">{user.points || 89}</div>
              <div className="text-xs tracking-[0.25em] text-gray-400 font-semibold uppercase mt-1">
                POINTS
              </div>
            </div>

            {/* Side nav */}
            <nav className="space-y-1 mb-8">
              {SIDE_NAV.map((item) => (
                <button
                  key={item.label}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-black hover:bg-pizza-gray rounded-lg transition-colors"
                >
                  <i className={`fas ${item.icon} w-5 text-center text-gray-400`} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="bg-black text-white font-bold py-3 px-5 rounded-full text-xs tracking-wider text-center hover:opacity-80 transition-opacity"
                >
                  <i className="fas fa-cog mr-2" />GESTIÓN
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-pizza-gray text-gray-600 font-bold py-3 px-5 rounded-full text-xs tracking-wider hover:opacity-80 transition-opacity"
              >
                <i className="fas fa-sign-out-alt mr-2" />CERRAR SESIÓN
              </button>
            </div>
          </div>

          {/* ========== RIGHT — 8 cols, RED ========== */}
          <div className="md:col-span-8 bg-[#B00000] p-8 lg:p-10 text-white min-h-[600px] flex flex-col">

            {/* Active delivery tracking */}
            {activeOrder && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-80">
                  <i className="fas fa-motorcycle mr-2" />Pedido activo
                </h2>

                {/* Steps */}
                <div className="flex items-center gap-2 mb-6">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        i <= activeStepIdx ? 'bg-white text-[#B00000]' : 'bg-white/20 text-white/60'
                      }`}>
                        {i <= activeStepIdx ? <i className="fas fa-check text-[10px]" /> : i + 1}
                      </div>
                      <span className={`text-xs font-semibold hidden sm:inline ${i <= activeStepIdx ? 'opacity-100' : 'opacity-40'}`}>
                        {step}
                      </span>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`w-6 h-0.5 ${i < activeStepIdx ? 'bg-white' : 'bg-white/20'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Orders list */}
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 opacity-80">
              <i className="fas fa-history mr-2" />Mis pedidos
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                <i className="fas fa-pizza-slice text-4xl mb-3 opacity-50" />
                <p className="text-sm font-semibold">No hay pedidos aún</p>
                <Link
                  to="/"
                  className="mt-4 bg-white text-[#B00000] px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Hacer mi primer pedido
                </Link>
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {orders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white text-black rounded-xl p-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="text-[11px] text-gray-400">Pedido #{order.id}</span>
                        <h3 className="font-bold text-sm">
                          {new Date(order.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-pizza-gray text-gray-600">
                          {order.status}
                        </span>
                        <span className="font-black text-[#B00000]">€{parseFloat(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {order.items.map((item, i) => (
                          <span key={i} className="bg-pizza-gray rounded-lg px-2.5 py-1 text-[11px] text-gray-500">
                            {item.name} ×{item.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Map placeholder */}
            <div className="mt-6 rounded-xl overflow-hidden min-h-[160px] relative bg-black/20">
              <img
                src="https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-3.7038,40.4168,13,0/600x300@2x?access_token=pk.placeholder"
                alt="Mapa de entrega"
                className="w-full h-full object-cover opacity-40"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-map-marker-alt text-2xl mb-2 block opacity-80" />
                  <p className="text-sm font-bold opacity-90">Madrid, España</p>
                  <p className="text-xs opacity-60 mt-1">Tiempo estimado: 25 min</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
