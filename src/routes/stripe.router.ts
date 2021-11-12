import { Router } from 'express'
import stripeController from '../controller/stripe.controller'

const router = Router()

router.post('/create-checkout-session', stripeController.createCheckoutSession)


export default router
