// =============================================
// Cart Context - Gestión del carrito de compras
// =============================================
import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Añadir producto al carrito
  const addToCart = useCallback((product, size = 'Medium', quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.size === size
      )

      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      }

      // Calcular precio según tamaño
      const sizeMultiplier = size === 'Small' ? 0.8 : size === 'XL' ? 1.3 : 1
      const adjustedPrice = parseFloat((product.price * sizeMultiplier).toFixed(2))

      return [...prev, {
        id: product.id,
        name: product.name,
        price: adjustedPrice,
        basePrice: product.price,
        image_url: product.image_url,
        size,
        quantity,
        category: product.category
      }]
    })
  }, [])

  // Eliminar producto del carrito
  const removeFromCart = useCallback((productId, size) => {
    setItems(prev => prev.filter(item => !(item.id === productId && item.size === size)))
  }, [])

  // Actualizar cantidad
  const updateQuantity = useCallback((productId, size, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }, [removeFromCart])

  // Vaciar carrito
  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // Toggle carrito
  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  // Totales
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      totalItems,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
