// =============================================
// PIZZA REACT - Express Server
// =============================================
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pizza React API is running' })
})

app.listen(PORT, () => {
  console.log(`🍕 Pizza React API running on http://localhost:${PORT}`)
})
