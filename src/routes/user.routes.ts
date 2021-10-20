import { Router } from 'express'
const router = Router()
import userController from '../controller/user.controller'

router.post('/user', userController.createUser)

export default router
