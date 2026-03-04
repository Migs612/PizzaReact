// =============================================
// Axios – Instancia global con interceptores JWT
// =============================================
import axios from 'axios'

const api = axios.create()

// ---- Request interceptor: inyectar JWT automáticamente ----
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ---- Response interceptor: manejar 401 globalmente ----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token')
      // Solo limpiar sesión si había un token (sesión expirada/inválida).
      // No limpiar durante login/register (no hay token aún).
      if (token && token !== 'mock-token') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Redirigir a login si no estamos ya ahí
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
