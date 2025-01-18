import mongoose from "mongoose"

const businessSchema = mongoose.Schema({
    code: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    owerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

export default mongoose.model("Business", businessSchema)