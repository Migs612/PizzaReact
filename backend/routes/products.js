import { Router } from 'express'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import { authMiddleware } from '../controllers/authController.js'

const router = Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', authMiddleware, createProduct)
router.put('/:id', authMiddleware, updateProduct)
router.delete('/:id', authMiddleware, deleteProduct)

export default router
