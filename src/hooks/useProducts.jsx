// =============================================
// useProducts Hook - Gestión de productos
// =============================================
import { useState, useEffect } from 'react'
import axios from 'axios'

// Datos mock de productos
const MOCK_PRODUCTS = [
  { id: 1, name: 'Pizza Margherita', description: 'La clásica italiana con tomate San Marzano, mozzarella fresca y albahaca', ingredients: 'Tomate San Marzano, Mozzarella di Bufala, Albahaca fresca, Aceite de oliva virgen extra', price: 12.99, category: 'Pizza', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800' },
  { id: 2, name: 'Pizza Pepperoni', description: 'Generosas rodajas de pepperoni sobre base de mozzarella fundida', ingredients: 'Pepperoni artesanal, Mozzarella, Salsa de tomate casera, Orégano', price: 14.99, category: 'Pizza', image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800' },
  { id: 3, name: 'Pizza BBQ Chicken', description: 'Pollo marinado en salsa BBQ con cebolla caramelizada', ingredients: 'Pollo a la parrilla, Salsa BBQ, Cebolla roja, Mozzarella, Cilantro', price: 16.99, category: 'Pizza', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800' },
  { id: 4, name: 'Pizza Quattro Formaggi', description: 'Cuatro quesos artesanales en perfecta armonía', ingredients: 'Mozzarella, Gorgonzola, Parmesano, Fontina, Nueces', price: 15.99, category: 'Pizza', image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800' },
  { id: 5, name: 'Pizza Hawaiana', description: 'La controversial favorita con piña dulce y jamón ahumado', ingredients: 'Jamón ahumado, Piña natural, Mozzarella, Salsa de tomate', price: 13.99, category: 'Pizza', image_url: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800' },
  { id: 6, name: 'Pizza Vegana Verde', description: 'Explosión de vegetales frescos sobre base de pesto', ingredients: 'Pesto vegano, Espinacas, Champiñones, Pimiento, Aceitunas, Tomate cherry', price: 14.99, category: 'Pizza', image_url: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800' },
  { id: 7, name: 'Pizza Diavola', description: 'Para los amantes del picante con nduja y guindilla', ingredients: 'Nduja, Salami picante, Guindilla fresca, Mozzarella, Miel', price: 15.99, category: 'Pizza', image_url: 'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=800' },
  { id: 8, name: 'Pizza Trufa Negra', description: 'Lujo en cada bocado con trufa negra y burrata', ingredients: 'Trufa negra, Burrata, Champiñones Portobello, Aceite de trufa', price: 19.99, category: 'Pizza', image_url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800' },
  { id: 9, name: 'Coca-Cola', description: 'Refresco clásico bien frío', ingredients: 'Coca-Cola Original 330ml', price: 2.99, category: 'Bebida', image_url: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800' },
  { id: 10, name: 'Agua Mineral', description: 'Agua mineral natural', ingredients: 'Agua mineral 500ml', price: 1.99, category: 'Bebida', image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800' },
  { id: 11, name: 'Cerveza Artesanal', description: 'Cerveza artesanal italiana', ingredients: 'Cerveza Moretti 330ml', price: 3.99, category: 'Bebida', image_url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800' },
  { id: 12, name: 'Limonada Casera', description: 'Limonada natural con menta fresca', ingredients: 'Limón, Menta, Azúcar de caña, Agua con gas', price: 3.49, category: 'Bebida', image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800' },
  { id: 13, name: 'Tiramisú', description: 'El clásico postre italiano con capas de mascarpone', ingredients: 'Mascarpone, Café espresso, Bizcocho, Cacao', price: 6.99, category: 'Postre', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800' },
  { id: 14, name: 'Panna Cotta', description: 'Suave crema italiana con coulis de frutos rojos', ingredients: 'Nata, Vainilla, Gelatina, Frutos rojos', price: 5.99, category: 'Postre', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800' },
  { id: 15, name: 'Brownie con Helado', description: 'Brownie caliente de chocolate con helado de vainilla', ingredients: 'Chocolate 70%, Mantequilla, Nueces, Helado artesanal', price: 7.49, category: 'Postre', image_url: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800' },
  { id: 16, name: 'Cannoli Siciliano', description: 'Crujiente masa rellena de ricotta dulce', ingredients: 'Ricotta, Pistachos, Chocolate, Masa crujiente', price: 5.49, category: 'Postre', image_url: 'https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=800' }
]

export function useProducts(category = null) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [category])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = category ? `?category=${category}` : ''
      const res = await axios.get(`/api/products${params}`)
      setProducts(res.data)
    } catch {
      // Fallback a datos mock
      const filtered = category
        ? MOCK_PRODUCTS.filter(p => p.category === category)
        : MOCK_PRODUCTS
      setProducts(filtered)
    } finally {
      setLoading(false)
    }
  }

  const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id)) || MOCK_PRODUCTS.find(p => p.id === parseInt(id))
  }

  const addProduct = async (product) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('/api/products', product, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(prev => [...prev, res.data])
      return { success: true }
    } catch {
      // Mock fallback
      const newProduct = { ...product, id: Math.max(...products.map(p => p.id), 0) + 1 }
      setProducts(prev => [...prev, newProduct])
      return { success: true }
    }
  }

  const updateProduct = async (id, product) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/products/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p))
      return { success: true }
    } catch {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p))
      return { success: true }
    }
  }

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(prev => prev.filter(p => p.id !== id))
      return { success: true }
    } catch {
      setProducts(prev => prev.filter(p => p.id !== id))
      return { success: true }
    }
  }

  return { products, loading, error, getProductById, addProduct, updateProduct, deleteProduct, refetch: fetchProducts }
}
