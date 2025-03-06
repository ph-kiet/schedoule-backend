import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    email: {
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
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    position: {
        type: String,
        required: true,
    },

    phoneNumber: {
        type: String,
        required: true
    },

    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
    },
}, 
{
    timestamps: true,
}

)

export default mongoose.model('User', userSchema)
