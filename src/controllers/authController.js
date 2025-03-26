import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import Business from '../models/businessModel.js'
import router from '../routes/authRoutes.js'

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