// =============================================
// Payment Methods Controller – CRUD for user cards
// =============================================
import pool from '../config/db.js'

// GET /api/payments — all payment methods for authenticated user
export const getPayments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, card_last4, exp_date, is_main FROM payment_methods WHERE user_id = ? ORDER BY is_main DESC, id ASC',
      [req.userId]
    )
    res.json(rows)
  } catch (error) {
    console.error('Error obteniendo métodos de pago:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// POST /api/payments — save a new card
export const createPayment = async (req, res) => {
  try {
    const { card_last4, exp_date, is_main } = req.body

    if (!card_last4 || card_last4.length < 3) {
      return res.status(400).json({ message: 'Los últimos 4 dígitos son obligatorios' })
    }

    // If this is set as main, unset others first
    if (is_main) {
      await pool.query('UPDATE payment_methods SET is_main = 0 WHERE user_id = ?', [req.userId])
    }

    // If user has no cards yet, force is_main = 1
    const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM payment_methods WHERE user_id = ?', [req.userId])
    const forceMain = existing[0].cnt === 0 ? 1 : (is_main ? 1 : 0)

    const [result] = await pool.query(
      'INSERT INTO payment_methods (user_id, card_last4, exp_date, is_main) VALUES (?, ?, ?, ?)',
      [req.userId, card_last4.slice(-4), exp_date || '', forceMain]
    )

    res.status(201).json({
      id: result.insertId,
      card_last4: card_last4.slice(-4),
      exp_date: exp_date || '',
      is_main: forceMain
    })
  } catch (error) {
    console.error('Error creando método de pago:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// DELETE /api/payments/:id — remove a card
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params

    // Verify ownership
    const [rows] = await pool.query('SELECT id, is_main FROM payment_methods WHERE id = ? AND user_id = ?', [id, req.userId])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Método de pago no encontrado' })
    }

    const wasMain = rows[0].is_main

    await pool.query('DELETE FROM payment_methods WHERE id = ? AND user_id = ?', [id, req.userId])

    // If we deleted the main card, promote the oldest remaining one
    if (wasMain) {
      await pool.query(
        'UPDATE payment_methods SET is_main = 1 WHERE user_id = ? ORDER BY id ASC LIMIT 1',
        [req.userId]
      )
    }

    res.json({ message: 'Método de pago eliminado' })
  } catch (error) {
    console.error('Error eliminando método de pago:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// PUT /api/payments/:id/main — set a card as main
export const setMainPayment = async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await pool.query('SELECT id FROM payment_methods WHERE id = ? AND user_id = ?', [id, req.userId])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Método de pago no encontrado' })
    }

    await pool.query('UPDATE payment_methods SET is_main = 0 WHERE user_id = ?', [req.userId])
    await pool.query('UPDATE payment_methods SET is_main = 1 WHERE id = ? AND user_id = ?', [id, req.userId])

    res.json({ message: 'Método de pago principal actualizado' })
  } catch (error) {
    console.error('Error actualizando método de pago principal:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}
