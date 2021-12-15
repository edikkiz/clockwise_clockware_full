import { Router } from 'express'
import orderController from '../controller/order.controller'
import masterController from '../controller/master.controller'
import cityController from '../controller/city.controller'
import userController from '../controller/user.controller'
import blogController from '../controller/blog.controller'

const router = Router()

router.put('/order', orderController.updateOrder)

router.delete('/delete-order', orderController.deleteOrder)

router.get('/orders-filtered', orderController.getAllOrders)

router.delete('/master', masterController.deleteMaster)

router.get('/masters', masterController.getMasters)

router.get('/all-masters', masterController.getAllMasters)
router.get('/masters-by-name', masterController.searchForMastersByName)

router.post('/city', cityController.createCity)

router.put('/city', cityController.updateCity)

router.delete('/city', cityController.deleteCity)

router.get('/users', userController.getUsers)

router.put('/user', userController.updateUser)

router.delete('/user', userController.deleteUser)

router.get('/diagrama/master', orderController.getDataForMasterDiagram)

router.get('/diagrama/city', orderController.getDataForCityDiagram)

router.get('/graph/city', orderController.getDataForCityGraph)

router.get('/graph/master', orderController.getDataForMasterGraph)

router.get('/masters-list', orderController.getDataForMasterTable)

router.get('/exportToXLSX', orderController.exportToXLSX)

router.post('/add-post', blogController.addPost)

router.put('/update-post', blogController.updatePost)

export default router
