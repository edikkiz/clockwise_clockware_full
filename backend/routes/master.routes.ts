import { Router } from 'express'
const router = Router()
import masterController from '../controller/master.controller'

router.get('/getFreeMasters', masterController.getFreeMasters)

router.post(
    '/masterRegistration',
    masterController.createMasters,
  )
// router.get('/getRating', masterController.getRating)
// router.get(
//     '/getMasterById',
//     ValidationMaster.validateGetMasterById,
//     masterController.getMasterById,
//   )
// router.put('/updateMasterRating', masterController.updateMasterRating)

export default router
