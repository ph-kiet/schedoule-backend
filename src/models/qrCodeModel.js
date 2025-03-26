import mongoose from "mongoose"

const qrCodeSchema = mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
}, 
{
    timestamps: true,
})