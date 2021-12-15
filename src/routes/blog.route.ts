import { Router } from 'express'
import blogController from '../controller/blog.controller'

const router = Router()

router.get('/posts', blogController.getPosts)

router.get('/one-post', blogController.getOnePost)
export default router
