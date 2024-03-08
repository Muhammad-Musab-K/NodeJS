import mongoose, { Schema } from "mongoose"


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        index: true,

    },
    fullname: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, " password is required"]
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Videos"
            }
        ]
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)