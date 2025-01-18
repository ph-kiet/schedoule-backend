import mongoose from "mongoose"

const rosterShema = mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    date: {
        type: Date,
    }
    
})

export default mongoose.model('Roster', rosterShema)