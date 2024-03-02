import mongoose, { Schema } from "mongoose"
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken"


const userSchema = new Schema(
    {
        username: {
            type: string,
            required: true,
            lowercase: true,
            trim: true,
            index: true

        },
        email: {
            type: string,
            required: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: string,
            required: true,
            trim: true,
        },
        avatar: {
            type: string,
            required: true,
        },
        coverImage: {
            type: string,
        },
        password: {
            type: string,
            required: true,
        },
    }
    , { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.password.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    return next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(this.password, password)
}

userSchema.methods.generateAccessToken = async function () {
    Jwt.sign({
        _id: this.id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expireIn: process.env.ACCESS_TOKEN_EXPIREY
        }
    )
}
userSchema.methods.generateRefreshToken = async function () {
    Jwt.sign({
        _id: this.id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expireIn: process.env.REFRESH_TOKEN_EXPIREY
        }
    )
}


export const User = mongoose.model("User", userSchema)