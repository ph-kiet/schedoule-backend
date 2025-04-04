import Business from "../models/businessModel.js"
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import generateRandomPassword from '../utils/randomPassword.js'
import QRCODE from 'qrcode'
import generateDailyToken from "../utils/generateDailyToken.js"
/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Employee >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// POST /employee
// Create a new employee
const createEmployee = async (req, res) => {
    try{
        const loggedInUserID = req.user.id

        const businessId = await Business.findOne({ownerId: loggedInUserID}, { _id: 1 })

        const {username, firstName, lastName, email, phoneNumber, position} = req.body

        let user = await User.findOne({username})
        if(user){
            return res.status(422).json({message: `${username} is taken!`})
        }


        user = new User({
            username: username,
            // password: await bcrypt.hash(generateRandomPassword(12), 10),
            password: await bcrypt.hash('password', 10),
            accountType: "EMPLOYEE",
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            position: position,
            businessId: businessId
        })

        await user.save();

        res.status(200).json({user: user})

    }catch(err){
        res.status(500).json({error: err.message})
    }
}

// PATCH /employee
// Update employee details
const updateEmployee = async (req, res) => {
    const loggedInUserID = req.user.id

    try{
        const businessId = await Business.findOne({ownerId: loggedInUserID}, { _id: 1 })
        const { username } = req.params;
        const { firstName, lastName, position, email, phoneNumber } = req.body;

        const user = await User.findOneAndUpdate({ username: username, businessId: businessId, accountType: "EMPLOYEE" }, 
                                                {firstName, lastName, position, email, phoneNumber},
                                                {new: true, select: '-password'});
        
        if(!user) return res.status(404).json({ message: 'Username is not found!'});

        res.status(200).json({updatedEmployee: user})

    } catch(err){
        res.status(500).json({error: err.message})
    }
}

// DELETE /employee
// Delete an employee 
const deleteEmployee = async (req, res) => {
    try{
        const loggedInUserID = req.user.id
        const businessId = await Business.findOne({ownerId: loggedInUserID}, { _id: 1 })

        const { username } = req.params

        const deletedEmployee = await User.findOneAndDelete({ username, businessId, accountType: "EMPLOYEE" })

        if(!deletedEmployee) return res.status(404).json({ message: `User ${username} is not found!` })

        res.status(200).json({deletedEmployee: deletedEmployee})
    } catch(err){
        res.status(500).json({error: err.message})
    }
}
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Employee <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> QR Code >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// GET /qr-code
const generateQRCode = async (req, res) => {
    const qrConfig = {
        errorCorrectionLevel: "H",
        type: 'image/png',
        scale: 10,
    }

    try {
        const loggedInUserID = req.user.id;
        const businessId = await Business.findOne(
          { ownerId: loggedInUserID },
          { _id: 1 }
        );
    
        const qrCodeToken = generateDailyToken(businessId._id)
        
        const qrUrl = `http://localhost:3000/attendance?token=${qrCodeToken}`

        const qrCodeImage = await QRCODE.toDataURL(qrUrl, qrConfig)
        
        res.json({
            qrCode: qrCodeImage,
            qrCodeToken: qrCodeToken,
            expires: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
        });
    
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to generate QR code' });
      }

}
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< QR Code <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Business >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// Get /business
// Get bussines details
const getBusinessDetails = async (req, res) => {
    const loggedInUserID = req.user.id

    try {
        const business = await Business.findOne({ownerId: loggedInUserID}, {_id: 0, name: 1, code: 1})

        return res.status(200).json({business: business})

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Business <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


export {createEmployee, updateEmployee, deleteEmployee, generateQRCode, getBusinessDetails}