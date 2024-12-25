const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    emailVerified: {
        type: Boolean,
        default: false
    },

    accountType: {
        type: String,
        require: true,
        enum: ["ADMIN", "BUSINESSOWNER", "EMPLOYEE"]
    }
}, 
{
    timestamps: true,
}

)

module.exports = mongoose.model('User', userSchema)