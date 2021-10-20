import { Router } from 'express'
const router = Router()
import orderController from '../controller/order.controller'

router.get('/clockSizes', orderController.getClockSizes)
router.get('/getOrderForFeedback', orderController.getOrderByFeedbackToken)
router.put('/updateFeedbackOrder', orderController.feedbackUpdate)
router.post('/order', orderController.createOrder)

export default router
