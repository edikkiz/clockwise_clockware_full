import { Router } from 'express'
const router = Router()
import AuthController from'../controller/auth.controller'

router.post('/login', AuthController.login)

export default router
