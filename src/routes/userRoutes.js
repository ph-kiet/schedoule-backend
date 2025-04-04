import express from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js'
import User from '../models/userModel.js'
import { getUserDetails, updateUserDetails, updateUserPassword } from '../controllers/userController.js';

const router = express.Router()

// Create new employee
router.get('/', [verifyToken, authorizeRoles("ADMIN", "BUSINESSOWNER", "EMPLOYEE")], getUserDetails)

// Update user details
router.patch('/', [verifyToken, authorizeRoles("ADMIN", "BUSINESSOWNER", "EMPLOYEE")], updateUserDetails)

// Change user password
router.patch('/change-password' , [verifyToken, authorizeRoles("ADMIN", "BUSINESSOWNER", "EMPLOYEE")], updateUserPassword)

export default router