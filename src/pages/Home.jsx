// =============================================
// Home Page - Wireframe: viewport 1920x920, no scroll, gray hero
// =============================================
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/Common/ProductCard'

const CATEGORIES = [
  { key: null, label: 'TODOS' },
  { key: 'Pizza', label: 'PIZZAS' },
  { key: 'Bebida', label: 'BEBIDAS' },
  { key: 'Postre', label: 'POSTRES' },
]

export default function Home() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [activeCategory, setActiveCategory] = useState(categoryParam || null)
  const { products, loading } = useProducts()

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products
    return products.filter(p => p.category === activeCategory)
  }, [products, activeCategory])

  // Mostrar máximo 8 cards para evitar scroll
  const visibleProducts = filteredProducts.slice(0, 8)

  return (
    <div className="min-h-[920px] bg-gray-100">
      {/* Contenedor centrado 1440px */}
      <div className="max-w-[1440px] mx-auto flex flex-col px-8">

        {/* Hero + Grid */}
        <div className="flex-1 flex flex-col pt-24">

          {/* Hero Section — fondo gris sólido, texto masivo */}
          <section className="text-center py-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-400 text-sm tracking-[0.3em] uppercase mb-2">
                Pizzería Artesanal · Desde 2020
              </p>
              <h1 className="text-[7rem] leading-none font-black text-pizza-red tracking-tight select-none">
                PIZZA
              </h1>
              <p className="text-gray-400 text-sm tracking-[0.25em] uppercase mt-1">
                Ingredientes frescos · Masa artesanal · Horno de leña
              </p>
            </motion.div>
          </section>

          {/* Category Filters */}
          <div className="flex justify-center gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-[0.15em] transition-all duration-300 ${
                  activeCategory === cat.key
                    ? 'bg-pizza-black text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid — 4 columnas, compacto */}
          <section className="flex-1 min-h-0">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-10 h-10 border-4 border-pizza-red border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {visibleProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
            )}

            {visibleProducts.length === 0 && !loading && (
              <div className="text-center py-16 text-gray-400">
                <i className="fas fa-search text-3xl mb-3 block" />
                <p>No se encontraron productos</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
