import { Router } from 'express'
const router = Router()
import masterController from '../controller/master.controller'

router.get('/free-masters', masterController.getFreeMasters)

router.post(
    '/master-registration',
    masterController.createMasters,
  )

export default router
