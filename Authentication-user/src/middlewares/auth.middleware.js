import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApisError } from "../utlis/ApisError.js";
import Jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("bearer ", "");

        if (!token) throw new ApisError(400, "invalid token")

        const decodeToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = User.findById(decodeToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApisError(401, "Invalid access Token")
        }

        req.user = user
        next()


    } catch (error) {
        throw ApisError(401, error.message || "Access token is not found")
    }
})
export { verifyJwt }