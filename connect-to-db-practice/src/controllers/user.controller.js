import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { fileUploadInCloudinary } from "../utils/cloudinary";

const register = asyncHandler(async (req, res) => {
    //get data from fe
    //check all data is available
    //check if it is already exists
    //check images are available
    //save image in cloudinary
    //creat user in db
    // res send of succes
    const { email, username, fullname, password } = req.body;
    console.log(req.body)

    if ([email, username, fullname, password].some(field => field === "")) {
        throw new ApiError(400, "fill the proper fields")
    }

    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existUser) {
        throw new ApiError(404, "User eamil or username is aalready exists")
    }

    const localAvatarPath = req.files?.avatar[0]?.path;
    let locatCoverImagePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        locatCoverImagePath = req.files?.coverImage[0]?.path
    }

    const avatar = await fileUploadInCloudinary(localAvatarPath)
    const coverImage = await fileUploadInCloudinary(locatCoverImagePath)

    if (!avatar) {
        throw new ApiError(400, "avatar picutre is not save yet!")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "User is not register !")
    }

    res.status(200).json(
        ApiResponse(200, createdUser, "User is registered succesfully")
    )

})

export {register}