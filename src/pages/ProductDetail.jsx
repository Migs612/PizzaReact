// =============================================
// ProductDetail – Brutaliste: 3-col, rounded-full selectors
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

const CRUSTS = ['Clásica', 'Fina', 'Rellena']

export default function ProductDetail() {
  const { id } = useParams()
  const { products, getProductById } = useProducts()
  const { addToCart, openCart } = useCart()
  const [selectedSize, setSelectedSize] = useState('Medium')
  const [selectedCrust, setSelectedCrust] = useState('Clásica')
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
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-5">
          <Link to="/" className="hover:text-pizza-red transition-colors">Inicio</Link>
          <span>/</span>
          <Link to={`/?category=${product.category}`} className="hover:text-pizza-red transition-colors">
            {product.category}s
          </Link>
          <span>/</span>
          <span className="text-black font-medium">{product.name}</span>
        </nav>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Col 1 – Image */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-[480px] object-cover"
              />
            </div>
          </motion.div>

          {/* Col 2 – Config */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="h-full flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
                {product.category}
              </span>
              <h1 className="text-3xl font-black text-pizza-red mb-2">{product.name}</h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{product.description}</p>

              {/* Size selector – rounded-full pills with black border */}
              {isPizza && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-3">Tamaño</h3>
                  <div className="flex gap-3">
                    {SIZES.map((size) => (
                      <button
                        key={size.key}
                        onClick={() => setSelectedSize(size.key)}
                        className={`px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-colors ${
                          selectedSize === size.key
                            ? 'border-black bg-black text-white'
                            : 'border-black text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Crust selector – rounded-full pills with black border */}
              {isPizza && (
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-3">Masa</h3>
                  <div className="flex gap-3">
                    {CRUSTS.map((crust) => (
                      <button
                        key={crust}
                        onClick={() => setSelectedCrust(crust)}
                        className={`px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-colors ${
                          selectedCrust === crust
                            ? 'border-black bg-black text-white'
                            : 'border-black text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {crust}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div className="mb-5">
                <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-2">Ingredientes</h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.split(',').map((ing, i) => (
                    <span key={i} className="bg-pizza-gray text-gray-600 text-[11px] px-3 py-1 rounded-full">
                      {ing.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-2">Cantidad</h3>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-full border-2 border-black hover:bg-black hover:text-white flex items-center justify-center font-bold transition-colors">−</button>
                  <span className="text-lg font-bold w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-full border-2 border-black hover:bg-black hover:text-white flex items-center justify-center font-bold transition-colors">+</button>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="text-3xl font-black text-pizza-red">
                    €{(dynamicPrice * quantity).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-pizza-red text-white font-black py-4 rounded-full text-sm uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
                >
                  <i className="fas fa-cart-plus mr-2" />AÑADIR AL CARRITO
                </button>
              </div>
            </div>
          </motion.div>

          {/* Col 3 – Suggestions */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="border border-gray-200 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-4">
                También te puede gustar
              </h3>
              <div className="space-y-3">
                {suggestions.map((sug) => (
                  <Link key={sug.id} to={`/product/${sug.id}`}
                    className="flex gap-3 p-2 rounded-xl hover:bg-pizza-gray transition-colors group">
                    <img src={sug.image_url} alt={sug.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-black group-hover:text-pizza-red truncate transition-colors">
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
