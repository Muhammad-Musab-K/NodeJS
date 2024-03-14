import mongoose, { Schema } from "mongoose"
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken"


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true

        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "videos"
            }
        ],
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        refreshToken: {
            type: String,
        }
    }
    , { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    return next()
})

userSchema.methods.isPasswordCorrect = function (password) {
    return bcrypt.compare(this.password, password)
}

userSchema.methods.generateAccessToken = function () {
    return Jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIREY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return Jwt.sign({
        _id: this._id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIREY
        }
    )
}
//arrow function access parent's this

export const User = mongoose.model("User", userSchema)