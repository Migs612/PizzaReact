// =============================================
// ProductCard – Brutaliste: white bg, border, + button
// =============================================
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, openCart } = useCart()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 'Medium')
    openCart()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors duration-200 relative">
          {/* + button */}
          <button
            onClick={handleQuickAdd}
            className="absolute top-3 right-3 z-10 bg-pizza-red text-white w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <i className="fas fa-plus text-xs" />
          </button>

          {/* Image */}
          <div className="overflow-hidden h-44">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-4 pt-3">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <h3 className="font-bold text-black text-[15px] leading-tight mb-1 group-hover:text-pizza-red transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed">
              {product.description}
            </p>
            <span className="text-xl font-black text-pizza-red">
              €{parseFloat(product.price).toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
