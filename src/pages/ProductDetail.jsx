// =============================================
// Product Detail Page – 3 columnas ESTRICTAS (nunca apila)
// =============================================
import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'

const SIZES = [
  { key: 'Small', label: 'Small', multiplier: 0.8, diameter: '25cm' },
  { key: 'Medium', label: 'Medium', multiplier: 1, diameter: '30cm' },
  { key: 'XL', label: 'XL', multiplier: 1.3, diameter: '38cm' },
]

export default function ProductDetail() {
  const { id } = useParams()
  const { products, getProductById } = useProducts()
  const { addToCart, openCart } = useCart()
  const [selectedSize, setSelectedSize] = useState('Medium')
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const found = getProductById(id)
    if (found) setProduct(found)
  }, [id, products])

  const dynamicPrice = useMemo(() => {
    if (!product) return 0
    const size = SIZES.find(s => s.key === selectedSize)
    return parseFloat((parseFloat(product.price) * size.multiplier).toFixed(2))
  }, [product, selectedSize])

  const suggestions = useMemo(() => {
    if (!product) return []
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3)
  }, [product, products])

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity)
    openCart()
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pizza-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isPizza = product.category === 'Pizza'

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-5">
          <Link to="/" className="hover:text-pizza-red transition-colors">Inicio</Link>
          <span>/</span>
          <Link to={`/?category=${product.category}`} className="hover:text-pizza-red transition-colors">
            {product.category}s
          </Link>
          <span>/</span>
          <span className="text-pizza-black font-medium">{product.name}</span>
        </nav>

        {/* ---- 3-Column Grid – SIEMPRE horizontal ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_280px] gap-6">

          {/* Col 1 – Imagen */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-[480px] object-cover"
              />
            </div>
          </motion.div>

          {/* Col 2 – Configuración */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 h-full flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
                {product.category}
              </span>
              <h1 className="text-2xl font-black text-pizza-black mb-2">{product.name}</h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{product.description}</p>

              {/* Ingredientes */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-pizza-black uppercase tracking-wider mb-2">Ingredientes</h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.split(',').map((ing, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded-full">
                      {ing.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selector de tamaño (solo pizzas) */}
              {isPizza && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-pizza-black uppercase tracking-wider mb-2">Tamaño</h3>
                  <div className="flex gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size.key}
                        onClick={() => setSelectedSize(size.key)}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-center transition-all text-sm ${
                          selectedSize === size.key
                            ? 'border-pizza-red bg-pizza-red/5 text-pizza-red font-bold'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">{size.label}</div>
                        <div className="text-[10px] opacity-60">{size.diameter}</div>
                        <div className="font-bold text-xs mt-0.5">
                          €{(parseFloat(product.price) * size.multiplier).toFixed(2)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div className="mb-4">
                <h3 className="text-xs font-bold text-pizza-black uppercase tracking-wider mb-2">Cantidad</h3>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition-colors">−</button>
                  <span className="text-lg font-bold w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-pizza-red hover:bg-pizza-red-dark text-white flex items-center justify-center font-bold transition-colors">+</button>
                </div>
              </div>

              {/* Precio + Botón */}
              <div className="mt-auto bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">Total</span>
                  <motion.span
                    key={`${dynamicPrice}-${quantity}`}
                    initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                    className="text-2xl font-black text-pizza-red"
                  >
                    €{(dynamicPrice * quantity).toFixed(2)}
                  </motion.span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full bg-pizza-red hover:bg-pizza-red-dark text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <i className="fas fa-cart-plus" /> Añadir al Carrito
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Col 3 – Sugerencias */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <h3 className="text-xs font-bold text-pizza-black uppercase tracking-wider mb-4">
                También te puede gustar
              </h3>
              <div className="space-y-3">
                {suggestions.map((sug) => (
                  <Link key={sug.id} to={`/product/${sug.id}`}
                    className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                    <img src={sug.image_url} alt={sug.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-pizza-black group-hover:text-pizza-red truncate transition-colors">
                        {sug.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 truncate">{sug.description}</p>
                      <p className="text-pizza-red font-bold text-xs mt-0.5">€{parseFloat(sug.price).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {suggestions.length === 0 && (
                <p className="text-gray-400 text-xs text-center py-4">Sin sugerencias</p>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
