import Business from "../models/businessModel.js"
import User from '../models/userModel.js'

const getAllEmployeesByBusinessCode = async (req, res) => {
    const loggedInUserID = req.user.id

    try{
        const businessId = await Business.findOne({ownerId: loggedInUserID}, { _id: 1 })

        const listOfEmployees = await User.find({businessId: businessId, accountType: "EMPLOYEE"}, { password: 0 })

        res.status(200).json({listOfEmployees: listOfEmployees})
    }catch(err){
        res.status(500).json({error: err.message})
    }
    
}

export {getAllEmployeesByBusinessCode}