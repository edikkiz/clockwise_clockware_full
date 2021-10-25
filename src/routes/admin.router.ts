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
    '/admin/get-free-masters',
    AuthController.checkAccessToken,
    masterController.getFreeMastersForPutOrder,
)

router.put(
    '/admin/delete-order',
    AuthController.checkAccessToken,
    orderController.deleteOrder,
)

router.get(
    '/admin/order',
    AuthController.checkAccessToken,
    orderController.getOrder,
) // where i need this??

router.get(
    '/admin/all-order',
    AuthController.checkAccessToken,
    orderController.getAllOrder,
)

router.get(
    '/admin/all-order-filtred',
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

router.post(
    '/admin/get-data-for-master-diagram',
    AuthController.checkAccessToken,
    orderController.getDataForMasterDiagram,
)

router.post(
    '/admin/get-data-for-city-diagram',
    AuthController.checkAccessToken,
    orderController.getDataForCityDiagram,
)

router.post(
    '/admin/get-data-for-city-graph',
    AuthController.checkAccessToken,
    orderController.getDataForCityGraph,
)

router.post(
    '/admin/get-data-for-master-graph',
    AuthController.checkAccessToken,
    orderController.getDataForMasterGraph,
)

router.get(
    '/admin/get-data-for-master-table',
    AuthController.checkAccessToken,
    orderController.getDataForMasterTable,
)
export default router
