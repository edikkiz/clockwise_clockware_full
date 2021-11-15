import { Router } from 'express'
import orderController from '../controller/order.controller'

const router = Router()

router.get('/user-orders', orderController.getAllOrdersToTheUserTable)
router.put('/add-photos', orderController.addPhotoInOrder)
export default router
