

import { User } from "../models/user.model.js";
import Jwt from "jsonwebtoken";
import { ApisError } from "../utlis/ApisError.js";
import { asyncHandler } from "../utlis/asyncHandler.js";

const verifyJwt = asyncHandler(async (req, _, next) => {
    try {
        const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("bearer ", "")
        if (!token) {
            throw new ApisError(401, "Invalid token")
        }
        console.log(token , "token")

        const decode = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decode) {
            throw new ApisError(404, "invalid decode token")
        }

        const user = await User.findById(decode._id).select("-password -refreshToken")

        if (!user) {
            throw new ApisError(404, "user not found")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApisError(401, error.message || "Access token is not found")    }

})

export {verifyJwt}