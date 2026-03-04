// =============================================
// Cart Drawer - Panel lateral del carrito
// =============================================
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer() {
  const { items, isOpen, closeCart, totalPrice, totalItems, updateQuantity, removeFromCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    closeCart()
    if (!user) {
      navigate('/auth')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col border-l border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-pizza-black flex items-center gap-2">
                <i className="fas fa-shopping-cart text-pizza-red" />
                Tu Carrito
                <span className="text-sm font-normal text-gray-500">({totalItems} items)</span>
              </h2>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <i className="fas fa-shopping-basket text-6xl mb-4" />
                  <p className="text-lg font-medium">Tu carrito está vacío</p>
                  <p className="text-sm">¡Añade algo delicioso!</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="flex gap-4 bg-gray-50 rounded-xl p-3"
                  >
                    {/* Image */}
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-pizza-black text-sm truncate">{item.name}</h3>
                      {item.category === 'Pizza' && (
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                          {item.size}
                        </span>
                      )}
                      <p className="text-pizza-red font-bold mt-1">€{parseFloat(item.price).toFixed(2)}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="font-semibold text-sm w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-pizza-red hover:bg-pizza-red-dark text-white flex items-center justify-center transition-colors text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-gray-400 hover:text-red-500 transition-colors self-start"
                    >
                      <i className="fas fa-trash-alt text-sm" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Total */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-lg font-bold text-pizza-black">€{parseFloat(totalPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Envío</span>
                  <span className="text-sm font-medium text-pizza-green">GRATIS</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-xl font-bold text-pizza-black">Total</span>
                  <span className="text-xl font-bold text-pizza-red">€{parseFloat(totalPrice).toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-pizza-red hover:bg-pizza-red-dark text-white font-bold py-4 rounded-xl transition-colors duration-200 text-lg"
                >
                  Realizar Pedido
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
