import { Router } from 'express'
import masterController from '../controller/master.controller'

const router = Router()

router.get('/free-masters', masterController.getFreeMasters)

router.post(
    '/master-registration',
    masterController.createMasters,
  )

export default router
