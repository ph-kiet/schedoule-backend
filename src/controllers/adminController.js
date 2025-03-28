import User from '../models/userModel.js'
import Business from '../models/businessModel.js'
import generateRandomPassword from '../utils/randomPassword.js'
import generateRandomBusinessCode from '../utils/randomBusinessCode.js'
import bcrypt from 'bcryptjs'

/* -------------------------------------------------- /api/admin/ -------------------------------------------------- */

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Business Owner >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// POST /businessOwner
// Create a new business owner
const createBusinessOwner = async (req, res) => {
    try{
        const {username, businessName, userDetails} = req.body

        let user = await User.findOne({username})
        if(user){
            return res.status(422).json({message: `${username} is taken!`})
        }

        user = new User({
            username: username,
            password: await bcrypt.hash('password', 10),
            // password: await bcrypt.hash(generateRandomPassword(12), 10),
            accountType: "BUSINESSOWNER",
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber,
            position: userDetails.position,
        })

        
        let businessCode = generateRandomBusinessCode();        
        let existingBusiness = await Business.findOne({code: businessCode})

        // If the business code is existing create a new one
        while(existingBusiness){
            businessCode = generateRandomBusinessCode();
            existingBusiness = await Business.findOne({code: businessCode})
        }

        const newBusiness = new Business({
            code: businessCode,
            name: businessName,
            ownerId: user._id
        });

        user.businessId = newBusiness._id

        await user.save();
        await newBusiness.save();

        res.status(200).json({user: user, business: newBusiness})

    } catch (err){
        res.status(500).json({error: err.message})
    }
}
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Business Owner <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */



/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Employee >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// POST /employee
// Create a new employee
const createEmployee = async (req, res) => {
    try{
        const {username, businessCode, firstName, lastName, email, phoneNumber, position} = req.body

        let user = await User.findOne({username})
        if(user){
            return res.status(422).json({message: `${username} is taken!`})
        }

        let business = await Business.findOne({code: businessCode})
        if(!business){
            return res.status(404).json({message: `Business ${businessCode} is not found!`})
        }

        user = new User({
            username: username,
            password: await bcrypt.hash(generateRandomPassword(12), 10),
            accountType: "EMPLOYEE",
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            position: position,
            businessId: business._id
        })

        await user.save();

        res.status(200).json({user: user})

    }catch(err){
        res.status(500).json({error: err.message})
    }
}
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Employee <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */



/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> User (General) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// PATCH /user
// Update user details
const updateUser = async (req, res) => {
    try{
        const { username } = req.params;
        const { firstName, lastName, position, email, phoneNumber, password, accountType, businessId } = req.body;

        const user = await User.findOne({ username });
        if(!user) return res.status(404).json({ message: 'Username is not found!'});

        // Build update user function later

        res.status(200).json({message: "Update user"})
    } catch(err){
        res.status(500).json({error: err.message})
    }
}


// DELETE /user
// Delete an user
const deleteUser = async (req, res) => {
    try{
        const { username } = req.params

        const deletedUser = await User.findOneAndDelete({ username })

        if(!deletedUser) return res.status(404).json({ message: `User ${username} is not found!` })

        res.status(200).json({message: `Deleted user ${username}.`})
    } catch(err){
        res.status(500).json({error: err.message})
    }
}
/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< User (General) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Businesses >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
// GET /businesses
const getAllBusiness = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({error: err.message})
    }
}

/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Businesses <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

export {createBusinessOwner,
        createEmployee,
        updateUser,
        deleteUser}