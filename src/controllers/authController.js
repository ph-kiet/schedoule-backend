import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import Business from '../models/businessModel.js'

const register = async (req, res) => {
    try{
        const {username, password, accountType} = req.body
        const hasedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({username, password: hasedPassword, accountType})
        await newUser.save();

        res.status(201).json(newUser)
    }catch (err) {
        res.status(500).jon({error: err})
    }
}

const login = async (req, res) => {
    try {
        const {username, password, businessCode} = req.body

        const business = await Business.findOne({code: businessCode})
        if(!business){
            return res.status(404).json({message: `Business ${businessCode} is not found!`})
        }

        const user = await User.findOne({username: username, businessId: business._id})
        if(!user) {
            return res.status(404).json({message: `${username} is not found!`})
        }
        
        const isMatched = await bcrypt.compare(password, user.password);
        
        if(!isMatched){
            return res.status(400).json({message: `Wrong password!`})
        }

        const token = jwt.sign(
            { id: user._id, accountType: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.status(200).json({token: token})



    } catch (err) {
        res.status(500).json({error: err.message})
    }
   

    
}

export {login, register}