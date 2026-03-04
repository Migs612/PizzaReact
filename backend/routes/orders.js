import { Router } from 'express'
import { createOrder, getUserOrders, updateOrderStatus } from '../controllers/orderController.js'
import { authMiddleware } from '../controllers/authController.js'

const router = Router()

router.post('/', authMiddleware, createOrder)
router.get('/', authMiddleware, getUserOrders)
router.put('/:id/status', authMiddleware, updateOrderStatus)

export default router
