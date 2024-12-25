const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/authMiddleware')
const authorizeRoles = require('../middlewares/roleMiddleware')
// Get all users
router.get('/', [verifyToken, authorizeRoles("ADMIN")] ,(req, res) => {
    
    res.json({message: "Welcome"})
    // try {
    //     const users = await User.find()
    //     res.json(users)
    // } catch(err) {
    //     res.status(500).json({message: err.message})
    // }
})

module.exports = router