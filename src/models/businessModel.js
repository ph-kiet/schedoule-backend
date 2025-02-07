import mongoose from "mongoose"

const businessSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, 
{
    timestamps: true,
}
)

export default mongoose.model("Business", businessSchema)