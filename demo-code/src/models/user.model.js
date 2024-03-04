import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
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
        index: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,

    },
    password: {
        type: String,
        required: true,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    avatar: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
    }


},
    {
        timestamps: true
    })

userSchema.pre("save", async function (next) {
    if (!this.password.isModified("password")) return next()
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
})

userSchema.methods.isPasswordAvailable = async function (password) {
    return await bcrypt.compare(this.password, password)
}

userSchema.methods.generateAccessToken = async function () {
    Jwt.sign({
        _id: this.id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    }
        ,
        process.env.ACCESS_TOKEN_SECRET
        , {
            expireIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}
userSchema.methods.generateFreshToken = async function () {
    Jwt.sign({
        _id: this.id,

    }
        ,
        process.env.FRESH_TOKEN_SECRET
        , {
            expireIn: process.env.FRESH_TOKEN_EXPIRY
        }
    )

}

export const User = mongoose.model("User", userSchema)