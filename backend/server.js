// =============================================
// PIZZA REACT - Express Server
// =============================================
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import addressRoutes from './routes/addresses.js'
import paymentRoutes from './routes/payments.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/payments', paymentRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pizza React API is running' })
})

// Serve frontend build in production
const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🍕 Pizza React API running on http://localhost:${PORT}`)
})
