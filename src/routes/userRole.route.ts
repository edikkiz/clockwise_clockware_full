import { Router } from 'express'
const router = Router()

import AuthController from '../controller/auth.controller'
import orderController from '../controller/order.controller'

  router.get(
    '/user/all-user-order',
    AuthController.checkAccessToken,
    orderController.getAllOrdersToTheUserTable,
  )
  

  export default router