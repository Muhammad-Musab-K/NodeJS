import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { ApisError } from "../utlis/ApisError.js"
import { User } from "../models/user.model.js"
import { FileUploadInCloudinary } from "../utlis/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {
    // get user data of all fields
    // validate user Data
    // username and email check if they already exist
    // check images and check avatar
    // avatar and image upload on cloudinary
    // create an object of user
    // check create user
    // res check
    const { username, email, fullname, password } = req.body

    if ([username, email, fullname, password].some(field => field === "")) {
        throw new ApisError(400, " Must Fulfilled All The Fields")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (user) {
        throw new ApisError(409, "Username or email already exists");
    }

    const localAvatarPath = await req.files?.avatar[0].path
    const localCoverImagePath = await req.files?.coverImage[0].path

    if (!localAvatarPath) {
        throw new ApisError(400, "The avatar is not find")
    }

    const avatar = await FileUploadInCloudinary(localAvatarPath)
    const coverImage = await FileUploadInCloudinary(localCoverImagePath)

    if (!avatar) {
        throw new ApisError(400, "The avatar is not uploaded")
    }

    const userData = await User.create({
        username: username,
        fullname,
        email,
        password,
        refreshToken,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    if (!userData) {
        throw new ApisError(500, "The is not register")
    }

    const modifiedData = await userData.findById(_id).select(
        "-password -refreshToken"
    )

    return res.status(201).json(
        new ApiResponse(200, modifiedData, "user register successfully")
    )




})

export default registerUser