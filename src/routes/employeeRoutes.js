import express from 'express'
const router = express.Router()
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js'
import { getAllEmployeesByBusinessCode, getTimeSheetByWeek } from '../controllers/employeeController.js';

router.get('/byBusiness', [verifyToken, authorizeRoles("BUSINESSOWNER")], getAllEmployeesByBusinessCode)
router.get('/timesheet/:startDate', [verifyToken, authorizeRoles("EMPLOYEE")], getTimeSheetByWeek)

export default router