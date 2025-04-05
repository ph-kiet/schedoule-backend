import express from 'express'
const router = express.Router()
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js'
import { createEmployee, deleteEmployee, generateQRCode, getBusinessDetails, updateBusinessDetails, updateEmployee } from '../controllers/businessOwnerController.js';


/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Employee >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// Create new employee with business code
router.post('/employee', [verifyToken, authorizeRoles("BUSINESSOWNER")], createEmployee)

// Update employee details
router.patch('/employee/:username', [verifyToken, authorizeRoles("BUSINESSOWNER")], updateEmployee)

// Delete an employee
router.delete('/employee/:username', [verifyToken, authorizeRoles("BUSINESSOWNER")], deleteEmployee)

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Employee <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> QR Code >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
router.get('/qr-code', [verifyToken, authorizeRoles('BUSINESSOWNER')], generateQRCode)
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< QR Code <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Business >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
router.get('/business', [verifyToken, authorizeRoles('BUSINESSOWNER')], getBusinessDetails)
router.patch('/business', [verifyToken, authorizeRoles('BUSINESSOWNER')], updateBusinessDetails)
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Business <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
export default router