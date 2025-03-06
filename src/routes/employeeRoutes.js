import express from 'express'
const router = express.Router()
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js'
import { getAllEmployeesByBusinessCode } from '../controllers/employeeController.js';

router.get('/byBusiness', [verifyToken, authorizeRoles("BUSINESSOWNER")], getAllEmployeesByBusinessCode)

export default router