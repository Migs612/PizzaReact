// =============================================
// Auth Controller
// =============================================
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

const JWT_SECRET = 'pizza_react_secret_key_2026'

// Registro de usuario
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // Verificar si el email ya existe
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' })
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Insertar usuario
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '24h' })

    res.status(201).json({
      token,
      user: { id: result.insertId, name, email, points: 89 }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Login de usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const user = users[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' })

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, points: user.points }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Obtener perfil del usuario
export const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, points FROM users WHERE id = ?', [req.userId])
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.json(users[0])
  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

// Middleware de autenticación
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.id
    req.userEmail = decoded.email
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' })
  }
}
