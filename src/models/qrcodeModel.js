import mongoose from "mongoose";

const qrcodeSchema = mongoose.Schema({
    businessId: {
        type: String,
        required: true
    },
    qrCode: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now,
        required: true
    },
})

const Qrcode = mongoose.model("Qrcode", qrcodeSchema);
module.exports = Qrcode;