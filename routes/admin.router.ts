import { Router } from 'express'
const router = Router()

import AuthController from '../controller/auth.controller'
import orderController from '../controller/order.controller'
import masterController from '../controller/master.controller'
import cityController from '../controller/city.controller'
import userController from '../controller/user.controller'

router.put(
  '/admin/order',
  AuthController.checkAccessToken,
  orderController.updateOrder,
)

router.get(
  '/admin/getFreeMasters',
  AuthController.checkAccessToken,
  masterController.getFreeMastersForPutOrder,
)

router.put(
  '/admin/deleteOrder',
  AuthController.checkAccessToken,
  orderController.deleteOrder,
)

router.get(
  '/admin/order',
  AuthController.checkAccessToken,
  orderController.getOrder,
) // where i need this??


router.get(
  '/admin/allOrder',
  AuthController.checkAccessToken,
  orderController.getAllOrder,
)

router.post(
  '/admin/allOrderGraph',
  AuthController.checkAccessToken,
  orderController.getAllOrderCharts,
)

router.post(
  '/admin/allOrderMasterDiagram',
  AuthController.checkAccessToken,
  orderController.getAllOrderMasterCharts,
)

router.get(
  '/admin/allMastersTableCharts',
  AuthController.checkAccessToken,
  masterController.getAllMastersForTableCharts,
)

router.post(
  '/admin/allOrderCityDiagram',
  AuthController.checkAccessToken,
  orderController.getAllOrderCityCharts,
)
router.get(
  '/admin/allOrderFiltred',
  AuthController.checkAccessToken,
  orderController.getAllOrderFiltred,
)

router.put(
  '/admin/master',
  AuthController.checkAccessToken,
  masterController.updateMaster,
)
router.delete(
  '/admin/master',
  AuthController.checkAccessToken,
  masterController.deleteMaster,
)

router.get(
  '/admin/master',
  AuthController.checkAccessToken,
  masterController.getMasters,
)

router.post(
  '/admin/city',
  AuthController.checkAccessToken,
  cityController.createCity,
)
router.put(
  '/admin/city',
  AuthController.checkAccessToken,
  cityController.updateCity,
)
router.delete(
  '/admin/city',
  AuthController.checkAccessToken,
  cityController.deleteCity,
)

router.get(
  '/admin/user',
  AuthController.checkAccessToken,
  userController.getUsers,
)

router.put(
  '/admin/user',
  AuthController.checkAccessToken,
  userController.updateUser,
)

router.delete(
  '/admin/user',
  AuthController.checkAccessToken,
  userController.deleteUser,
)

export default router
