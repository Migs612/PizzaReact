// =============================================
// Checkout Page - Simulación de pago
// =============================================
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useOrders } from '../hooks/useOrders'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const { createOrder, simulateOrderProgress } = useOrders()
  const { user, updatePoints } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('review') // review, payment, processing, confirmed
  const [address, setAddress] = useState({
    street: '',
    city: 'Madrid',
    zip: '28001',
    phone: ''
  })

  const handlePay = async () => {
    setStep('processing')

    // Simular carga de pago (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Crear pedido
    const orderItems = items.map(item => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      quantity: item.quantity,
      size: item.size
    }))

    const result = await createOrder(orderItems, totalPrice)

    if (result.success) {
      // Simular progresión de estados
      simulateOrderProgress(result.order.id)

      // Actualizar puntos del usuario
      const newPoints = (user.points || 0) + Math.floor(totalPrice)
      updatePoints(newPoints)

      clearCart()
      setStep('confirmed')
    }
  }

  // Si no hay items y no estamos en confirmación, redirigir
  if (items.length === 0 && step !== 'confirmed') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-black mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-6">Añade productos antes de continuar</p>
          <button
            onClick={() => navigate('/')}
            className="bg-pizza-red text-white px-8 py-3 rounded-full font-bold hover:bg-pizza-red-dark transition-colors"
          >
            Ver Menú
          </button>
        </div>
      </div>
    )
  }

  // Pantalla de procesamiento
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-20 h-20 border-4 border-pizza-red border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-black mb-2">Procesando pago...</h2>
          <p className="text-gray-500">No cierres esta ventana</p>
        </motion.div>
      </div>
    )
  }

  // Pantalla de confirmación
  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-white rounded-3xl border border-gray-200 p-10 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <i className="fas fa-check text-green-500 text-4xl" />
          </motion.div>

          <h2 className="text-3xl font-black text-black mb-3">¡Pedido Confirmado!</h2>
          <p className="text-gray-500 mb-6">
            Tu pizza está siendo preparada con mucho amor 🍕
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Total pagado</span>
              <span className="font-bold text-pizza-red">€{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Puntos ganados</span>
              <span className="font-bold text-pizza-gold">+{Math.floor(totalPrice)} pts</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <p className="text-blue-600 text-sm">
              <i className="fas fa-info-circle mr-2" />
              El estado de tu pedido se actualizará automáticamente.
              Puedes seguirlo desde tu perfil.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="bg-pizza-red hover:bg-pizza-red-dark text-white font-bold py-3 rounded-xl transition-colors"
            >
              Ver Mi Pedido
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-pizza-gray hover:opacity-80 text-gray-700 font-bold py-3 rounded-xl transition-opacity"
            >
              Volver al Menú
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Vista de revisión del pedido
  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-black mb-8"
        >
          Finalizar Pedido
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <h2 className="font-bold text-lg text-black mb-4 flex items-center gap-2">
                <i className="fas fa-shopping-bag text-pizza-red" /> Tu Pedido
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      {item.category === 'Pizza' && (
                        <span className="text-xs text-gray-500">Tamaño: {item.size}</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">x{item.quantity}</span>
                    <span className="font-bold text-pizza-red">€{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <h2 className="font-bold text-lg text-pizza-black mb-4 flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-pizza-red" /> Dirección de Entrega
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="Calle, número, piso"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pizza-red focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pizza-red focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pizza-red focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+34 600 000 000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pizza-red focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
              <h2 className="font-bold text-lg text-black mb-4">Resumen</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Puntos a ganar</span>
                  <span className="font-medium text-yellow-600">+{Math.floor(totalPrice)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-black text-2xl text-pizza-red">€{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePay}
                className="w-full bg-pizza-red hover:bg-pizza-red-dark text-white font-bold py-4 rounded-xl text-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <i className="fas fa-lock" />
                Pagar €{totalPrice.toFixed(2)}
              </motion.button>

              <p className="text-xs text-gray-400 text-center mt-4">
                <i className="fas fa-shield-alt mr-1" />
                Pago seguro y cifrado
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
