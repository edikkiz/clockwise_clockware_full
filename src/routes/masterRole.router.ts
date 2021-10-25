import { Router } from 'express'
const router = Router()

import AuthController from '../controller/auth.controller'
import orderController from '../controller/order.controller'

router.put(
    '/master/re-status', 
    AuthController.checkAccessToken,
    orderController.updateOrderStatus,
  )

  router.get(
    '/master/all-master-order',
    AuthController.checkAccessToken,
    orderController.getAllOrdersToTheMasterTable,
  )
  

  export default router