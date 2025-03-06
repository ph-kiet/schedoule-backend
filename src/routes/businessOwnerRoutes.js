import express from 'express'
const router = express.Router()
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js'
import { createEmployee, deleteEmployee, updateEmployee } from '../controllers/businessOwnerController.js';


/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Employee >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// Create new employee with business code
router.post('/employee', [verifyToken, authorizeRoles("BUSINESSOWNER")], createEmployee)

// Update employee details
router.patch('/employee/:username', [verifyToken, authorizeRoles("BUSINESSOWNER")], updateEmployee)

// Delete an employee
router.delete('/employee/:username', [verifyToken, authorizeRoles("BUSINESSOWNER")], deleteEmployee)

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Employee <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


export default router