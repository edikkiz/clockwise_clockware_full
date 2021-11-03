import { Router } from 'express'
import CityController from '../controller/city.controller'

const router = Router()

router.get('/city', CityController.getCities)

export default router
