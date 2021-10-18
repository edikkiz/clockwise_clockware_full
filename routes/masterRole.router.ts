import { Router } from 'express'
const router = Router()

import AuthController from '../controller/auth.controller'
import orderController from '../controller/order.controller'

router.put(
    '/master/reStatus', 
    AuthController.checkAccessToken,
    orderController.updateOrderStatus,
  )

  router.get(
    '/master/allMasterOrder',
    AuthController.checkAccessToken,
    orderController.getAllOrdersToTheMasterTable,
  )
  

  export default router