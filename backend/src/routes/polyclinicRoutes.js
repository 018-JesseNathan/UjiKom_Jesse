import express from 'express'
import { getAllPolyclinics, getPolyclinicById, createPolyclinic, updatePolyclinic, deletePolyclinic } from '../controllers/polyclinicController.js'

const router = express.Router()

router.get('/poliklinik', getAllPolyclinics)
router.get('/poliklinik/:id', getPolyclinicById)
router.post('/poliklinik', createPolyclinic)
router.put('/poliklinik/:id', updatePolyclinic)
router.delete('/poliklinik/:id', deletePolyclinic)

export default router
