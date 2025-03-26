import express from 'express'
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js'
import { qrCheckIn, qrCheckOut } from '../controllers/qrCodeController.js';

const router = express.Router()

router.post('/check-in', [verifyToken], qrCheckIn)
router.post('/check-out', [verifyToken], qrCheckOut)

export default router