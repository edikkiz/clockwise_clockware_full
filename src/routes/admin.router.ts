import { Router } from 'express'
const router = Router()

import AuthController from '../controller/auth.controller'
import orderController from '../controller/order.controller'
import masterController from '../controller/master.controller'
import cityController from '../controller/city.controller'
import userController from '../controller/user.controller'

router.put(
    '/order',
    AuthController.checkAccessToken,
    orderController.updateOrder,
)

router.get(
    '/free-masters',
    AuthController.checkAccessToken,
    masterController.getFreeMastersForPutOrder,
)

router.delete(
    '/delete-order',
    AuthController.checkAccessToken,
    orderController.deleteOrder,
)

router.get(
    '/orders-filtered',
    AuthController.checkAccessToken,
    orderController.getAllOrders,
)

router.delete(
    '/master',
    AuthController.checkAccessToken,
    masterController.deleteMaster,
)

router.get(
    '/masters',
    AuthController.checkAccessToken,
    masterController.getMasters,
)

router.post('/city', AuthController.checkAccessToken, cityController.createCity)

router.put('/city', AuthController.checkAccessToken, cityController.updateCity)
router.delete(
    '/city',
    AuthController.checkAccessToken,
    cityController.deleteCity,
)

router.get('/users', AuthController.checkAccessToken, userController.getUsers)

router.put('/user', AuthController.checkAccessToken, userController.updateUser)

router.delete(
    '/user',
    AuthController.checkAccessToken,
    userController.deleteUser,
)

router.get(
    '/diagrama/master',
    AuthController.checkAccessToken,
    orderController.getDataForMasterDiagram,
)

router.get(
    '/diagrama/city',
    AuthController.checkAccessToken,
    orderController.getDataForCityDiagram,
)

router.get(
    '/graph/city',
    AuthController.checkAccessToken,
    orderController.getDataForCityGraph,
)

router.get(
    '/graph/master',
    AuthController.checkAccessToken,
    orderController.getDataForMasterGraph,
)

router.get(
    '/tabel/masters',
    AuthController.checkAccessToken,
    orderController.getDataForMasterTable,
)
export default router
