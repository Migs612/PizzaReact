// =============================================
// Orders Controller
// =============================================
import pool from '../config/db.js'

// Crear pedido
export const createOrder = async (req, res) => {
  try {
    const { items, total } = req.body
    const userId = req.userId

    const [orderResult] = await pool.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [userId, total, 'Pendiente']
    )

    const orderId = orderResult.insertId

    // Insertar items del pedido
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.size || 'Medium']
      )
    }

    // Añadir puntos al usuario
    const pointsEarned = Math.floor(total)
    await pool.query('UPDATE users SET points = points + ? WHERE id = ?', [pointsEarned, userId])

    res.status(201).json({
      id: orderId,
      status: 'Pendiente',
      total,
      pointsEarned
    })
  } catch (error) {
    console.error('Error creando pedido:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Obtener pedidos del usuario
export const getUserOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, GROUP_CONCAT(
        JSON_OBJECT('product_id', oi.product_id, 'quantity', oi.quantity, 'size', oi.size, 'name', p.name, 'price', p.price, 'image_url', p.image_url)
      ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [req.userId]
    )

    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items ? JSON.parse(`[${order.items}]`) : []
    }))

    res.json(formattedOrders)
  } catch (error) {
    console.error('Error obteniendo pedidos:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Actualizar estado del pedido
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id])
    res.json({ message: 'Estado actualizado', status })
  } catch (error) {
    console.error('Error actualizando pedido:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}
