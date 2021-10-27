import { Router } from 'express'
const router = Router()

import AuthController from '../controller/auth.controller'
import orderController from '../controller/order.controller'

router.put(
    '/change-status',
    AuthController.checkAccessToken,
    orderController.updateOrderStatus,
)

router.get(
    '/master-orders',
    AuthController.checkAccessToken,
    orderController.getAllOrdersToTheMasterTable,
)

export default router
