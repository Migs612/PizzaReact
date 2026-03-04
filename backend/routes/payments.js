import { Router } from 'express'
import { getPayments, createPayment, deletePayment, setMainPayment } from '../controllers/paymentController.js'
import { authMiddleware } from '../controllers/authController.js'

const router = Router()

router.get('/',          authMiddleware, getPayments)
router.post('/',         authMiddleware, createPayment)
router.delete('/:id',    authMiddleware, deletePayment)
router.put('/:id/main',  authMiddleware, setMainPayment)

export default router
