// =============================================
// Auth Context - JWT + localStorage persistence + auto-login
// =============================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'

const AuthContext = createContext(null)

// Datos mock para funcionar sin backend
const MOCK_USERS = [
  { id: 1, name: 'Admin Pizza', email: 'admin@adminpizza.es', password: 'admin123', points: 89 },
  { id: 2, name: 'Juan García', email: 'juan@email.com', password: 'user123', points: 89 }
]

const API_URL = '/api/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [useMock, setUseMock] = useState(false)

  // ---- Auto-login: verificar token guardado al cargar la app ----
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      // Si es token real, intentar verificar con backend
      if (savedToken !== 'mock-token') {
        api.get(`${API_URL}/profile`)
          .then(res => {
            // Token válido — actualizar con datos frescos del backend
            const freshUser = res.data
            setUser(freshUser)
            setToken(savedToken)
            localStorage.setItem('user', JSON.stringify(freshUser))
          })
          .catch(() => {
            // Token expirado/inválido — usar datos locales si existen,
            // o limpiar sesión
            try {
              const parsedUser = JSON.parse(savedUser)
              setUser(parsedUser)
              setToken(savedToken)
            } catch {
              // Datos corruptos
              localStorage.removeItem('token')
              localStorage.removeItem('user')
            }
          })
          .finally(() => setLoading(false))
      } else {
        // Mock token — restaurar sesión mock
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          setToken('mock-token')
          setUseMock(true)
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
        setLoading(false)
      }
    } else {
      // Sin token guardado
      setLoading(false)
    }
  }, [])

  // ---- Persistir usuario en localStorage ----
  const persistSession = useCallback((userData, newToken, isMock = false) => {
    setUser(userData)
    setToken(newToken)
    setUseMock(isMock)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  // ---- Login ----
  const login = async (email, password) => {
    try {
      const res = await api.post(`${API_URL}/login`, { email, password })
      const { token: newToken, user: userData } = res.data
      persistSession(userData, newToken)
      return { success: true }
    } catch (error) {
      // Fallback a mock si el backend no está disponible
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password)
      if (mockUser) {
        const userData = { id: mockUser.id, name: mockUser.name, email: mockUser.email, points: mockUser.points }
        persistSession(userData, 'mock-token', true)
        return { success: true }
      }
      return { success: false, message: error.response?.data?.message || 'Credenciales inválidas' }
    }
  }

  // ---- Registro ----
  const register = async (name, email, password) => {
    try {
      const res = await api.post(`${API_URL}/register`, { name, email, password })
      const { token: newToken, user: userData } = res.data
      persistSession(userData, newToken)
      return { success: true }
    } catch (error) {
      // Fallback mock
      if (MOCK_USERS.find(u => u.email === email)) {
        return { success: false, message: 'El email ya está registrado' }
      }
      const newId = MOCK_USERS.length + 1
      const userData = { id: newId, name, email, points: 0 }
      MOCK_USERS.push({ ...userData, password })
      persistSession(userData, 'mock-token', true)
      return { success: true }
    }
  }

  // ---- Logout ----
  const logout = () => {
    setUser(null)
    setToken(null)
    setUseMock(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // ---- Admin check: siempre basado en email ----
  const isAdmin = user?.email === 'admin@adminpizza.es'

  // ---- Actualizar puntos ----
  const updatePoints = (newPoints) => {
    if (user) {
      const updatedUser = { ...user, points: newPoints }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAdmin,
      login,
      register,
      logout,
      updatePoints
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
