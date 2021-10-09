import { Router } from 'express'
const router = Router()

import AuthController from '../controller/auth.controller'
import orderController from '../controller/order.controller'

  router.get(
    '/user/allUserOrder',
    AuthController.checkAccessToken,
    orderController.getAllOrdersToTheUserTable,
  )
  

  export default router