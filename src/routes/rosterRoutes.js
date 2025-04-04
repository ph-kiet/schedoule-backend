import express from 'express'
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js'
import {createNewRoster, getRosterByMonthAndYear, updateAssignedRoster, deleteRoster} from '../controllers/rosterController.js'


const router = express.Router()

// Create new roster for employee
router.post('/', [verifyToken, authorizeRoles("BUSINESSOWNER")], createNewRoster)

// Get roster by month
router.get('/byMonthAndYear/:month/:year', [verifyToken, authorizeRoles("BUSINESSOWNER")], getRosterByMonthAndYear)

// Update assigned roster
router.put('/', [verifyToken, authorizeRoles("BUSINESSOWNER")], updateAssignedRoster)

// Delete roster
router.delete('/:id', [verifyToken, authorizeRoles("BUSINESSOWNER")], deleteRoster)

export default router