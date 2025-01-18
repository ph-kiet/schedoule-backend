import User from '../models/userModel.js'
import Business from '../models/businessModel.js'
import generateRandomPassword from '../utils/randomPassword.js'

// Create businessOwner
const createBusinessOwner = async (req, res) => {
    try{
        const {username, businessName} = req.body

        const user = await User.findOne({username})
        if(user){
            return res.status(422).json({message: `${username} is taken!`})
        }

        // user = new User({
        //     username: username,
        //     password: generateRandomPassword(12),
        //     accountType: "BUSINESSOWNER"
        // })

        // user.save()


        const businessCounter = await User.countDocuments() // Get 
        // const business = new Business({
        //     code: businessCounter.length + 1,
        //     name: businessName
        // })

        res.status(200).json({businessCounter: businessCounter.length + 1})

    } catch (err){
        res.status(500).json({error: err.message})
    }
    

    
}

// Create employee
const createEmployee = (req, res) => {
    res.json({message: 'Employee'})
}

export {createBusinessOwner, createEmployee}