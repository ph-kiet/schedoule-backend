import express from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js'
import User from '../models/userModel.js'
import {createBusinessOwner, createEmployee} from '../controllers/userController.js';

const router = express.Router()

// Get all users
router.get('/', [verifyToken, authorizeRoles("ADMIN")] , async (req, res) => {
    
    // res.json({message: "Welcome"})
    try {
        const users = await User.find()
        res.json(users)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// Create new business owner by admin
router.post('/businessOwner', [verifyToken, authorizeRoles("ADMIN")], createBusinessOwner)

// Create new employee
router.post('/employee', [verifyToken, authorizeRoles("ADMIN", "BUSINESSOWNER")], createEmployee)


export default router