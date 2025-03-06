import express from 'express'
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js'
import {createNewRoster} from '../controllers/rosterController.js'


const router = express.Router()

router.post('/', [verifyToken, authorizeRoles("ADMIN", "BUSINESSOWNER")], createNewRoster)

export default router