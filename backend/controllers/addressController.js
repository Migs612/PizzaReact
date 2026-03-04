// =============================================
// Addresses Controller – CRUD for user addresses
// =============================================
import pool from '../config/db.js'

// GET /api/addresses — all addresses for authenticated user
export const getAddresses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, label, street, city, postal_code, phone, is_main FROM addresses WHERE user_id = ? ORDER BY is_main DESC, id ASC',
      [req.userId]
    )
    res.json(rows)
  } catch (error) {
    console.error('Error obteniendo direcciones:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// POST /api/addresses — create a new address
export const createAddress = async (req, res) => {
  try {
    const { label, street, city, postal_code, phone, is_main } = req.body

    if (!street || !street.trim()) {
      return res.status(400).json({ message: 'La calle es obligatoria' })
    }

    // If this is set as main, unset others first
    if (is_main) {
      await pool.query('UPDATE addresses SET is_main = 0 WHERE user_id = ?', [req.userId])
    }

    // If user has no addresses yet, force is_main = 1
    const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM addresses WHERE user_id = ?', [req.userId])
    const forceMain = existing[0].cnt === 0 ? 1 : (is_main ? 1 : 0)

    const [result] = await pool.query(
      'INSERT INTO addresses (user_id, label, street, city, postal_code, phone, is_main) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.userId, label || 'Casa', street, city || 'Madrid', postal_code || '28001', phone || null, forceMain]
    )

    res.status(201).json({
      id: result.insertId,
      label: label || 'Casa',
      street,
      city: city || 'Madrid',
      postal_code: postal_code || '28001',
      phone: phone || null,
      is_main: forceMain
    })
  } catch (error) {
    console.error('Error creando dirección:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// DELETE /api/addresses/:id — remove an address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params

    // Verify ownership
    const [rows] = await pool.query('SELECT id, is_main FROM addresses WHERE id = ? AND user_id = ?', [id, req.userId])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Dirección no encontrada' })
    }

    const wasMain = rows[0].is_main

    await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, req.userId])

    // If we deleted the main address, promote the oldest remaining one
    if (wasMain) {
      await pool.query(
        'UPDATE addresses SET is_main = 1 WHERE user_id = ? ORDER BY id ASC LIMIT 1',
        [req.userId]
      )
    }

    res.json({ message: 'Dirección eliminada' })
  } catch (error) {
    console.error('Error eliminando dirección:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// PUT /api/addresses/:id/main — set an address as main
export const setMainAddress = async (req, res) => {
  try {
    const { id } = req.params

    // Verify ownership
    const [rows] = await pool.query('SELECT id FROM addresses WHERE id = ? AND user_id = ?', [id, req.userId])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Dirección no encontrada' })
    }

    await pool.query('UPDATE addresses SET is_main = 0 WHERE user_id = ?', [req.userId])
    await pool.query('UPDATE addresses SET is_main = 1 WHERE id = ? AND user_id = ?', [id, req.userId])

    res.json({ message: 'Dirección principal actualizada' })
  } catch (error) {
    console.error('Error actualizando dirección principal:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}
