import { Router } from 'express'
import orderController from '../controller/order.controller'

const router = Router()

router.put('/change-status', orderController.updateOrderStatus)

router.get('/master-orders', orderController.getAllOrdersToTheMasterTable)

router.get('/master-calendar', orderController.getAllOrdersToTheMasterCalendar)

router.get('/orderPdf', orderController.sendCheckPdfFile)

export default router
