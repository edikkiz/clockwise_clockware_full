import { Router } from 'express'
import userController from '../controller/user.controller'

const router = Router()

router.post('/user', userController.createUser)

export default router
