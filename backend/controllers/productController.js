// =============================================
// Products Controller
// =============================================
import pool from '../config/db.js'

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query
    let query = 'SELECT * FROM products'
    let params = []

    if (category) {
      query += ' WHERE category = ?'
      params.push(category)
    }

    const [products] = await pool.query(query, params)
    res.json(products)
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (products.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }
    res.json(products[0])
  } catch (error) {
    console.error('Error obteniendo producto:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Crear producto (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, description, ingredients, price, category, image_url } = req.body
    const [result] = await pool.query(
      'INSERT INTO products (name, description, ingredients, price, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, ingredients, price, category, image_url]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (error) {
    console.error('Error creando producto:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Actualizar producto (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, ingredients, price, category, image_url } = req.body
    await pool.query(
      'UPDATE products SET name=?, description=?, ingredients=?, price=?, category=?, image_url=? WHERE id=?',
      [name, description, ingredients, price, category, image_url, req.params.id]
    )
    res.json({ id: req.params.id, ...req.body })
  } catch (error) {
    console.error('Error actualizando producto:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Eliminar producto (Admin)
export const deleteProduct = async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])
    res.json({ message: 'Producto eliminado' })
  } catch (error) {
    console.error('Error eliminando producto:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}
