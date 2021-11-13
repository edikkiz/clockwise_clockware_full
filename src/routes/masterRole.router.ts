import { Router } from 'express'
import orderController from '../controller/order.controller'

const router = Router()

router.put('/change-status', orderController.updateOrderStatus)

router.get('/master-orders', orderController.getAllOrdersToTheMasterTable)

router.get('/count-orders', orderController.countOrdersOfMaster)
export default router
