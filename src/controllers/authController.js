import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import Business from '../models/businessModel.js'
import generateRandomBusinessCode from '../utils/randomBusinessCode.js'

const register = async (req, res) => {
    try{
        const {userDetails, businessDetails} = req.body

        const existingUser = await User.findOne({username: userDetails.username})
        
        if(existingUser){
            return res.status(400).json({errorMsg: `${userDetails.username} is taken!`})
        }


        let businessCode = generateRandomBusinessCode();        
        let existingBusiness = await Business.findOne({code: businessCode})

        // If the business code is existing create a new one
        while(existingBusiness){
            businessCode = generateRandomBusinessCode();
            existingBusiness = await Business.findOne({code: businessCode})
        }

        const hasedPassword = await bcrypt.hash(userDetails.password, 10);
        const newUser = new User({firstName: userDetails.firstName, lastName: userDetails.lastName, email: userDetails.email, phoneNumber: userDetails.phoneNumber, username: userDetails.username, password: hasedPassword, accountType: "BUSINESSOWNER", position: "owner"})
        
        const newBusiness = new Business({code: businessCode, name: businessDetails.businessName, ownerId: newUser._id, address: businessDetails.address, location: businessDetails.location})
        
        newUser.businessId = newBusiness._id
        await newUser.save();
        await newBusiness.save();

        res.status(200).json({message: `User created successfully! Your business ID is ${businessCode}. `})
    }catch (err) {
        console.log(err)
        res.status(500).json({errorMsg: err})
    }
}

const login = async (req, res) => {
    try {
        const {username, password, businessCode} = req.body

        const business = await Business.findOne({code: businessCode})
        if(!business){
            return res.status(400).json({errorMsg: `Business ${businessCode} is not found!`})
        }

        const user = await User.findOne({username: username, businessId: business._id})
        if(!user) {
            return res.status(400).json({errorMsg: `${username} is not found!`})
        }
        
        const isMatched = await bcrypt.compare(password, user.password);
        
        if(!isMatched){
            return res.status(400).json({errorMsg: `Wrong password!`})
        }

        const token = jwt.sign(
            { id: user._id, accountType: user.accountType, firstName: user.firstName, lastName: user.lastName },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_SECRET_EXPIRY }
        )

        res.status(200).json({token: token})



    } catch (err) {
        res.status(500).json({error: err.message})
    }
   

    
}

const QRLogin = async (req, res) => {
    try {
        const {username, password, businessCode} = req.body

        const business = await Business.findOne({code: businessCode})
        if(!business){
            return res.status(400).json({errorMsg: `Business ${businessCode} is not found!`})
        }

        const user = await User.findOne({username: username, businessId: business._id})
        if(!user) {
            return res.status(400).json({errorMsg: `${username} is not found!`})
        }

        if(user.accountType !== "BUSINESSOWNER"){
            return res.status(400).json({errorMsg: `${username} is not found!`})
        }
        
        const isMatched = await bcrypt.compare(password, user.password);
        
        if(!isMatched){
            return res.status(400).json({errorMsg: `Wrong password!`})
        }

        const accessToken = jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_SECRET_EXPIRY}
        )

        const refreshToken = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET_REFRESH,
            {expiresIn: process.env.JWT_SECRET_REFRESH_EXPIRY}
        )

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15552000000
        })

        res.status(200).json({
            token: accessToken,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ 
          success: false,
          message: 'No refresh token provided' 
        });
    }

    try{
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid refresh token' 
            });
        }

        const newAccessToken = jwt.sign(
            { id: user._id, accountType: user.accountType, firstName: user.firstName, lastName: user.lastName },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_SECRET_EXPIRY}
        )

        res.status(200).json({
            success: true,
            token: newAccessToken
        });

    }catch(error){
        console.log(error)
        res.status(401).json({ 
            success: false,
            message: 'Invalid or expired refresh token' 
        });
    }
}

const logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
}

const getUser = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select(['firstName', 'lastName']).populate('businessId', ['name']);
        res.status(200).json(user);
    }catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
}

export {login, register, QRLogin, refreshToken, logout, getUser}