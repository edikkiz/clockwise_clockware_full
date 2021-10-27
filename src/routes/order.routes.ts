import { Router } from 'express'
const router = Router()
import orderController from '../controller/order.controller'

router.get('/clock-sizes', orderController.getClockSizes)
router.get('/order-for-feedback', orderController.getOrderByFeedbackToken)
router.put('/add-feedback', orderController.feedbackUpdate)
router.post('/order', orderController.createOrder)

export default router
