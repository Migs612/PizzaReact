import { Router } from 'express'
import { register, login, getProfile, authMiddleware } from '../controllers/authController.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', authMiddleware, getProfile)

export default router
