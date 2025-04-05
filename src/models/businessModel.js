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
    },
    address: {
        type: String,
        require: true,
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    }
}, 
{
    timestamps: true,
}
)

export default mongoose.model("Business", businessSchema)