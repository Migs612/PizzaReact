// =============================================
// Profile Page – Split blanco / rojo (wireframe)
// =============================================
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../hooks/useOrders'

const STATUS_STEPS = ['Pendiente', 'Preparando', 'En camino', 'Entregado']
const STATUS_COLORS = {
  'Pendiente': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'Preparando': 'bg-blue-100 text-blue-700 border border-blue-200',
  'En camino': 'bg-purple-100 text-purple-700 border border-purple-200',
  'Entregado': 'bg-green-100 text-green-700 border border-green-200',
}

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
    <div className="min-h-screen bg-gray-100 pt-24 pb-0">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* ---- Split layout: izquierda blanco / derecha rojo ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0 rounded-2xl overflow-hidden border border-gray-200">

          {/* ========== COLUMNA IZQUIERDA — Blanca ========== */}
          <div className="bg-white p-8 lg:p-10">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8 pb-6 border-b border-gray-100"
            >
              {/* Avatar */}
              <div className="w-16 h-16 bg-pizza-red rounded-full flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              {/* Info */}
              <div className="flex-1">
                <h1 className="text-xl font-black text-pizza-black">{user.name}</h1>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              {/* Points */}
              <div className="bg-pizza-black text-white rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-black">{user.points || 89}</div>
                <div className="text-[10px] tracking-[0.2em] opacity-70 font-semibold">POINTS</div>
              </div>
              {/* Actions */}
              <div className="flex gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-pizza-black text-white font-bold py-2.5 px-5 rounded-xl text-xs tracking-wider hover:bg-gray-800 transition-colors"
                  >
                    <i className="fas fa-cog mr-1.5" />GESTIÓN
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-600 font-bold py-2.5 px-5 rounded-xl text-xs tracking-wider hover:bg-gray-200 transition-colors"
                >
                  <i className="fas fa-sign-out-alt mr-1.5" />SALIR
                </button>
              </div>
            </motion.div>

            {/* Order History */}
            <h2 className="text-sm font-bold text-pizza-black uppercase tracking-wider mb-4 flex items-center gap-2">
              <i className="fas fa-history text-pizza-red" /> Historial de Pedidos
            </h2>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-pizza-red border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <i className="fas fa-receipt text-4xl mb-3 block" />
                <p className="text-sm font-medium">Aún no tienes pedidos</p>
                <Link
                  to="/"
                  className="inline-block mt-4 bg-pizza-red text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-pizza-red-dark transition-colors"
                >
                  Hacer mi primer pedido
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <span className="text-xs text-gray-400">Pedido #{order.id}</span>
                        <h3 className="font-bold text-sm text-pizza-black">
                          {new Date(order.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="font-black text-pizza-red">€{parseFloat(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {order.items.map((item, i) => (
                          <span key={i} className="bg-gray-50 rounded-lg px-2.5 py-1 text-[11px] text-gray-500 border border-gray-100">
                            {item.name} ×{item.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ========== COLUMNA DERECHA — Roja ========== */}
          <div className="bg-pizza-red p-8 lg:p-10 text-white flex flex-col">
            {/* Delivery Status */}
            <h2 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 opacity-90">
              <i className="fas fa-motorcycle" /> Estado del Pedido
            </h2>

            {activeOrder ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Progress Steps – vertical */}
                <div className="space-y-4 mb-8">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        i <= activeStepIdx
                          ? 'bg-white text-pizza-red'
                          : 'bg-white/20 text-white/60'
                      }`}>
                        {i <= activeStepIdx ? <i className="fas fa-check text-[10px]" /> : i + 1}
                      </div>
                      <span className={`text-sm font-semibold ${i <= activeStepIdx ? 'opacity-100' : 'opacity-50'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress bar horizontal */}
                <div className="h-1.5 bg-white/20 rounded-full mb-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((activeStepIdx + 1) / STATUS_STEPS.length) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                  />
                </div>

                {/* Map placeholder */}
                <div className="rounded-xl overflow-hidden flex-1 min-h-[180px] relative bg-pizza-red-dark">
                  <img
                    src="https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-3.7038,40.4168,13,0/600x300@2x?access_token=pk.placeholder"
                    alt="Mapa de entrega"
                    className="w-full h-full object-cover opacity-60"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-map-marker-alt text-3xl mb-2 block opacity-80" />
                      <p className="text-sm font-bold opacity-90">Tiempo estimado: 25 min</p>
                      <p className="text-xs opacity-60 mt-1">Madrid, España</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                <i className="fas fa-pizza-slice text-5xl mb-4 opacity-50" />
                <p className="text-sm font-semibold">No hay pedidos activos</p>
                <p className="text-xs opacity-60 mt-1">¡Haz un pedido para ver el seguimiento!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
