import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApisError } from "../utlis/ApisError.js";
import { User } from "../models/user.model.js"
import { FileUploadInCloudinary } from "../utlis/cloudinary.js";
import { ApiResponse } from "../utlis/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user fields-done
    //validation of all fields-done
    //check if username and email is already exits-done
    //check image and avatar-done
    //upload them into cloudinary-done
    //create user object , create entry in db-done
    //remove password from the user object-done
    //check the user is created or  not -done
    //res check
    const { username, fullname, email, password } = req.body
    if ([username, fullname, email, password].some(field => field.trim() === "")) {
        throw new ApisError(400, "Fulfill all fields must")
        //for check all the fields are fulfilled or not if any field is emplty it return an error
    }

    const exitsedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (exitsedUser) {
        throw new ApisError(400, "user Laready exist ")
    }
    //for check is the username or email is already exits in database so it throw an error

    const localFilesAvatar = req.files?.avatar[0]?.path
    const localFilesCoverImage = req.files?.coverImage[0]?.path

    if (!localFilesAvatar) {
        throw new ApisError(400, "The avatar is not available")
    }
    const avatar = await FileUploadInCloudinary(localFilesAvatar)
    const coverImage = await FileUploadInCloudinary(localFilesCoverImage)

    if (!avatar) {
        throw new ApisError(400, "Avatar file is required")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    const creatUser = await user.findById(_id).select(
        "-password -refreshToken"
    )

    if (!creatUser) {
        throw new ApisError(500, "something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, creatUser, "Successfully registered")
    )
})

export default registerUser