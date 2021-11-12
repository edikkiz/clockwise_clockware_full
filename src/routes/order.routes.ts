import { Router } from 'express'
import orderController from '../controller/order.controller'

const router = Router()

router.get('/clock-sizes', orderController.getClockSizes)
router.get('/order-for-feedback', orderController.getOrderByFeedbackToken)
router.put('/add-feedback', orderController.feedbackUpdate)
// router.post('/order', orderController.createOrder)


export default router
