import bcrypt from 'bcryptjs'
import User from "../models/userModel.js"


// GET 
// get user details for profile page
const getUserDetails = async (req, res) => {
    const loggedInUserID = req.user.id

    try {
        const user = await User.findOne({_id: loggedInUserID},  {firstName: 1, lastName: 1, email: 1, phoneNumber: 1 })
        res.status(200).json({user: user})
    } catch (error) {
        res.status(500).json(error)
    }
}

// PATCH
// Update user details from profile page
const updateUserDetails = async (req, res) => {
    const loggedInUserID = req.user.id
    const {firstName, lastName, phoneNumber} = req.body
    try {
        const user = await User.findOneAndUpdate({_id: loggedInUserID}, {firstName, lastName, phoneNumber}, {new: true, select: 'firstName lastName phoneNumber'});

        if(!user) return res.status(404).json({ message: 'User is not found!'});
        res.status(200).json({updatedUser: user})

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

// PATCH /change-password
// Update user password from profile page
const updateUserPassword = async (req, res) => {
    const loggedInUserID = req.user.id
    const {password, newPassword, confirmPassword} = req.body
    try {
        const user = await User.findOne({_id: loggedInUserID})
        if(!user) return res.status(404).json({ message: 'User is not found!'});

        const isMatched = await bcrypt.compare(password, user.password);

        if(!isMatched){
            return res.status(400).json({errorMsg: `Current password is not correct!`})
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({errorMsg: `Confirm password does not match!`})
        }

        if(newPassword === password){
            return res.status(400).json({errorMsg: `New password cannot be the same as the old password!`})
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        res.status(200).json({message: "Password updated successfully!"})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export {getUserDetails, updateUserDetails, updateUserPassword}