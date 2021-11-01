import { Router } from 'express'
const router = Router()

import AuthController from '../controller/auth.controller'
import orderController from '../controller/order.controller'
import masterController from '../controller/master.controller'
import cityController from '../controller/city.controller'
import userController from '../controller/user.controller'

router.put(
    '/order',
    AuthController.checkAccessToken('admin'),
    orderController.updateOrder,
)

router.delete(
    '/delete-order',
    AuthController.checkAccessToken('admin'),
    orderController.deleteOrder,
)

router.get(
    '/orders-filtered',
    AuthController.checkAccessToken('admin'),
    orderController.getAllOrders,
)

router.delete(
    '/master',
    AuthController.checkAccessToken('admin'),
    masterController.deleteMaster,
)

router.get(
    '/masters',
    AuthController.checkAccessToken('admin'),
    masterController.getMasters,
)

router.post(
    '/city',
    AuthController.checkAccessToken('admin'),
    cityController.createCity,
)

router.put(
    '/city',
    AuthController.checkAccessToken('admin'),
    cityController.updateCity,
)
router.delete(
    '/city',
    AuthController.checkAccessToken('admin'),
    cityController.deleteCity,
)

router.get(
    '/users',
    AuthController.checkAccessToken('admin'),
    userController.getUsers,
)

router.put(
    '/user',
    AuthController.checkAccessToken('admin'),
    userController.updateUser,
)

router.delete(
    '/user',
    AuthController.checkAccessToken('admin'),
    userController.deleteUser,
)

router.get(
    '/diagrama/master',
    AuthController.checkAccessToken('admin'),
    orderController.getDataForMasterDiagram,
)

router.get(
    '/diagrama/city',
    AuthController.checkAccessToken('admin'),
    orderController.getDataForCityDiagram,
)

router.get(
    '/graph/city',
    AuthController.checkAccessToken('admin'),
    orderController.getDataForCityGraph,
)

router.get(
    '/graph/master',
    AuthController.checkAccessToken('admin'),
    orderController.getDataForMasterGraph,
)

router.get(
    '/masters-list',
    AuthController.checkAccessToken('admin'),
    orderController.getDataForMasterTable,
)
export default router
