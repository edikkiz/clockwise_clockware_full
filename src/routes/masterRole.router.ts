import { Router } from 'express'
const router = Router()

import AuthController from '../controller/auth.controller'
import orderController from '../controller/order.controller'

router.put(
    '/change-status',
    AuthController.checkAccessToken('master'),
    orderController.updateOrderStatus,
)

router.get(
    '/master-orders',
    AuthController.checkAccessToken('master'),
    orderController.getAllOrdersToTheMasterTable,
)

export default router
