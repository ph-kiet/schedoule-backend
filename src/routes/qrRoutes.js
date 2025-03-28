import express from 'express'
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js'
import { qrCheckIn, qrCheckOut } from '../controllers/qrCodeController.js';

const router = express.Router()

router.post('/check-in', [verifyToken, authorizeRoles("EMPLOYEE")], qrCheckIn)
router.post('/check-out', [verifyToken, authorizeRoles("EMPLOYEE")], qrCheckOut)

export default router