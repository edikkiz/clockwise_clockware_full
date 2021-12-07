import { Router } from 'express'
import blogController from '../controller/blog.controller'

const router = Router()

router.get('/posts', blogController.getPosts)

export default router
