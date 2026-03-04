import { Router } from 'express'
import { getAddresses, createAddress, deleteAddress, setMainAddress } from '../controllers/addressController.js'
import { authMiddleware } from '../controllers/authController.js'

const router = Router()

router.get('/',          authMiddleware, getAddresses)
router.post('/',         authMiddleware, createAddress)
router.delete('/:id',    authMiddleware, deleteAddress)
router.put('/:id/main',  authMiddleware, setMainAddress)

export default router
