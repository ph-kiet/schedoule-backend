import mongoose from "mongoose"

const rosterShema = mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    shiftStart: {
        type: Date,
        required: true
    },
    shiftEnd: {
        type: Date,
        required: true
    },
    breakTime: {
        type: Number,
    }

}, 
{
    timestamps: true,
})

export default mongoose.model('Roster', rosterShema)