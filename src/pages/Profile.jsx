// =============================================
// Profile – Brutaliste: 4+8 col split (white / red)
// =============================================
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import api from '../lib/axios'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../hooks/useOrders'

const STATUS_STEPS = ['Pendiente', 'Preparando', 'En camino', 'Entregado']

const SIDE_NAV = [
  { icon: 'fa-receipt', label: 'Mis pedidos', tab: 'pedidos' },
  { icon: 'fa-undo', label: 'Devoluciones', tab: 'devoluciones' },
  { icon: 'fa-map-marker-alt', label: 'Direcciones', tab: 'direcciones' },
  { icon: 'fa-credit-card', label: 'Métodos de pago', tab: 'metodos_pago' },
  { icon: 'fa-cog', label: 'Configuración', tab: 'configuracion' },
]

export default function Profile() {
  const { user, isAdmin, logout, loading: authLoading } = useAuth()
  const { orders, loading } = useOrders()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pedidos')

  // ---- Addresses CRUD state (MySQL via API) ----
  const [addresses, setAddresses] = useState([])
  const [showAddrForm, setShowAddrForm] = useState(false)
  const [newAddr, setNewAddr] = useState({ label: '', street: '', city: 'Madrid', zip: '28001', phone: '' })

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/api/addresses')
      setAddresses(res.data)
    } catch { /* mock fallback – keep current state */ }
  }
  const addAddress = async () => {
    if (!newAddr.street.trim()) return
    try {
      await api.post('/api/addresses', {
        label: newAddr.label || 'Casa',
        street: newAddr.street,
        city: newAddr.city,
        postal_code: newAddr.zip,
        phone: newAddr.phone,
        is_main: addresses.length === 0
      })
      await fetchAddresses()
    } catch { /* silent */ }
    setNewAddr({ label: '', street: '', city: 'Madrid', zip: '28001', phone: '' })
    setShowAddrForm(false)
  }
  const removeAddress = async (id) => {
    try {
      await api.delete(`/api/addresses/${id}`)
      await fetchAddresses()
    } catch { /* silent */ }
  }
  const setPrimaryAddress = async (id) => {
    try {
      await api.put(`/api/addresses/${id}/main`, {})
      await fetchAddresses()
    } catch { /* silent */ }
  }

  // ---- Payment methods CRUD state (MySQL via API) ----
  const [cards, setCards] = useState([])
  const [showCardForm, setShowCardForm] = useState(false)
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '' })

  const fetchCards = async () => {
    try {
      const res = await api.get('/api/payments')
      setCards(res.data)
    } catch { /* mock fallback */ }
  }
  const addCard = async () => {
    if (!newCard.number.trim() || newCard.number.replace(/\s/g,'').length < 13) return
    const last4 = newCard.number.replace(/\s/g,'').slice(-4)
    try {
      await api.post('/api/payments', {
        card_last4: last4,
        exp_date: newCard.expiry,
        is_main: cards.length === 0
      })
      await fetchCards()
    } catch { /* silent */ }
    setNewCard({ number: '', expiry: '', cvv: '' })
    setShowCardForm(false)
  }
  const removeCard = async (id) => {
    try {
      await api.delete(`/api/payments/${id}`)
      await fetchCards()
    } catch { /* silent */ }
  }
  const setPrimaryCard = async (id) => {
    try {
      await api.put(`/api/payments/${id}/main`, {})
      await fetchCards()
    } catch { /* silent */ }
  }

  // Fetch addresses & cards from API on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && token !== 'mock-token') {
      fetchAddresses()
      fetchCards()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth')
  }, [user, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pizza-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const activeOrder = orders.find(o => o.status !== 'Entregado')
  const activeStepIdx = activeOrder ? STATUS_STEPS.indexOf(activeOrder.status) : -1

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // ---- Tab content renderers ----
  const renderPedidos = () => (
    <>
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
    </>
  )

  const renderMetodosPago = () => (
    <div className="flex-1 flex flex-col">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-80">
        <i className="fas fa-credit-card mr-2" />Métodos de pago
      </h2>

      {cards.length === 0 && !showCardForm && (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 mb-6">
          <i className="fas fa-credit-card text-4xl mb-3 opacity-50" />
          <p className="text-sm font-semibold">No hay tarjetas guardadas</p>
        </div>
      )}

      {/* Saved cards list */}
      {cards.map((card) => (
        <div key={card.id} className="bg-white text-black rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pizza-gray rounded-lg flex items-center justify-center">
                <i className="fab fa-cc-visa text-xl text-gray-600" />
              </div>
              <div>
                <p className="font-bold text-sm">Visa •••• {card.card_last4}</p>
                <p className="text-[11px] text-gray-400">Expira {card.exp_date || '—'}</p>
              </div>
            </div>
            {card.is_main === 1 && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Principal
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {!card.is_main && (
              <>
                <button onClick={() => setPrimaryCard(card.id)} className="text-xs text-blue-500 hover:text-blue-700 transition-colors">Hacer principal</button>
                <span className="text-gray-300">|</span>
              </>
            )}
            <button onClick={() => removeCard(card.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Eliminar</button>
          </div>
        </div>
      ))}

      {/* Add new card form */}
      {showCardForm ? (
        <div className="bg-white/10 border border-white/20 rounded-xl p-5">
          <h3 className="font-bold text-sm mb-4">Añadir nueva tarjeta</h3>
          <div className="space-y-3">
            <input
              type="text" placeholder="Número de tarjeta"
              value={newCard.number}
              onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/50"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text" placeholder="MM/AA"
                value={newCard.expiry}
                onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/50"
              />
              <input
                type="text" placeholder="CVV"
                value={newCard.cvv}
                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/50"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={addCard} className="flex-1 bg-white text-[#B00000] font-bold py-3 rounded-full text-xs tracking-wider hover:opacity-90 transition-opacity">
                GUARDAR TARJETA
              </button>
              <button onClick={() => setShowCardForm(false)} className="flex-1 bg-white/10 border border-white/20 text-white font-bold py-3 rounded-full text-xs tracking-wider hover:bg-white/20 transition-colors">
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowCardForm(true)} className="w-full bg-white/10 border border-white/20 text-white font-bold py-3 rounded-full text-xs tracking-wider hover:bg-white/20 transition-colors">
          + AÑADIR TARJETA
        </button>
      )}
    </div>
  )

  const renderDevoluciones = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
      <i className="fas fa-undo text-4xl mb-3 opacity-50" />
      <p className="text-sm font-semibold">No hay devoluciones activas</p>
      <p className="text-xs opacity-60 mt-2">Si necesitas devolver un pedido, contacta con soporte.</p>
    </div>
  )

  const renderDirecciones = () => (
    <div className="flex-1 flex flex-col">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-80">
        <i className="fas fa-map-marker-alt mr-2" />Mis direcciones
      </h2>

      {addresses.length === 0 && !showAddrForm && (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 mb-6">
          <i className="fas fa-map-marker-alt text-4xl mb-3 opacity-50" />
          <p className="text-sm font-semibold">No hay direcciones guardadas</p>
        </div>
      )}

      {/* Saved addresses list */}
      {addresses.map((addr) => (
        <div key={addr.id} className="bg-white text-black rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">{addr.label || 'Dirección'}</p>
              <p className="text-xs text-gray-400 mt-1">{addr.street}, {addr.postal_code} {addr.city}</p>
              {addr.phone && <p className="text-xs text-gray-400">{addr.phone}</p>}
            </div>
            {addr.is_main === 1 && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Principal
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            {!addr.is_main && (
              <>
                <button onClick={() => setPrimaryAddress(addr.id)} className="text-xs text-blue-500 hover:text-blue-700 transition-colors">Hacer principal</button>
                <span className="text-gray-300">|</span>
              </>
            )}
            <button onClick={() => removeAddress(addr.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Eliminar</button>
          </div>
        </div>
      ))}

      {/* Add new address form */}
      {showAddrForm ? (
        <div className="bg-white/10 border border-white/20 rounded-xl p-5">
          <h3 className="font-bold text-sm mb-4">Nueva dirección</h3>
          <div className="space-y-3">
            <input
              type="text" placeholder="Etiqueta (ej: Casa, Trabajo)"
              value={newAddr.label}
              onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/50"
            />
            <input
              type="text" placeholder="Calle, número, piso"
              value={newAddr.street}
              onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/50"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text" placeholder="Ciudad"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/50"
              />
              <input
                type="text" placeholder="Código Postal"
                value={newAddr.zip}
                onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/50"
              />
            </div>
            <input
              type="tel" placeholder="Teléfono"
              value={newAddr.phone}
              onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/50"
            />
            <div className="flex gap-2">
              <button onClick={addAddress} className="flex-1 bg-white text-[#B00000] font-bold py-3 rounded-full text-xs tracking-wider hover:opacity-90 transition-opacity">
                GUARDAR
              </button>
              <button onClick={() => setShowAddrForm(false)} className="flex-1 bg-white/10 border border-white/20 text-white font-bold py-3 rounded-full text-xs tracking-wider hover:bg-white/20 transition-colors">
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAddrForm(true)} className="w-full bg-white/10 border border-white/20 text-white font-bold py-3 rounded-full text-xs tracking-wider hover:bg-white/20 transition-colors">
          + AÑADIR DIRECCIÓN
        </button>
      )}
    </div>
  )

  const renderConfiguracion = () => (
    <div className="flex-1 flex flex-col">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 opacity-80">
        <i className="fas fa-cog mr-2" />Configuración
      </h2>
      <div className="space-y-4">
        <div className="bg-white text-black rounded-xl p-5">
          <h3 className="font-bold text-sm mb-1">Notificaciones</h3>
          <p className="text-xs text-gray-400">Recibe alertas sobre tus pedidos y ofertas.</p>
        </div>
        <div className="bg-white text-black rounded-xl p-5">
          <h3 className="font-bold text-sm mb-1">Idioma</h3>
          <p className="text-xs text-gray-400">Español (España)</p>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pedidos': return renderPedidos()
      case 'devoluciones': return renderDevoluciones()
      case 'direcciones': return renderDirecciones()
      case 'metodos_pago': return renderMetodosPago()
      case 'configuracion': return renderConfiguracion()
      default: return renderPedidos()
    }
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
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                    activeTab === item.tab
                      ? 'bg-pizza-gray text-black font-semibold'
                      : 'text-gray-600 hover:text-black hover:bg-pizza-gray'
                  }`}
                >
                  <i className={`fas ${item.icon} w-5 text-center ${activeTab === item.tab ? 'text-pizza-red' : 'text-gray-400'}`} />
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
            {renderTabContent()}
          </div>

        </div>
      </div>
    </div>
  )
}
