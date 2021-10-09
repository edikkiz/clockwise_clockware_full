import { Router } from 'express'
const router = Router()
import CityController from '../controller/city.controller'

router.get('/city', CityController.getCities)

export default router
