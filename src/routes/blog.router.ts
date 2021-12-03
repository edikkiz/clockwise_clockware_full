import { Router } from 'express'
import blogController from '../controller/blog.controller'

const router = Router()

router.post('/upload/img', blogController.uploadImage)

export default router
