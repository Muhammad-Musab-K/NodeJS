import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { ApisError } from "../utlis/ApisError.js"
import { User } from "../models/user.model.js"
import { FileUploadInCloudinary } from "../utlis/cloudinary.js";




const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApisError(404, "User not found")
        }
        const accessToken = await generateAccessToken()
        const refreshToken = await generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validaBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApisError(404, "Something went wrong while generating referesh and access token")
    }
}

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
    console.log("body", req.body)

    if ([username, email, fullname, password].some(field => field === "")) {
        throw new ApisError(400, " Must Fulfilled All The Fields")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApisError(409, "Username or email already exists");
    }
    console.log("files", req.files)
    const localAvatarPath = req.files?.avatar[0]?.path;
    console.log(localAvatarPath)
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }


    if (!localAvatarPath) {
        throw new ApisError(400, "The avatar is not find")
    }

    const avatar = await FileUploadInCloudinary(localAvatarPath)
    const coverImage = await FileUploadInCloudinary(coverImageLocalPath)


    if (!avatar) {
        throw new ApisError(400, "The avatar is not uploaded")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApisError(500, "The is not register")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "user register successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    //get data from req.body-done
    // username or email-done
    // find user-done
    // check password-done
    // access and refresh token
    // send cookie-done

    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApisError(400, "please enter username or email")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw ApisError(404, "user is not found")
    }

    const checkpassword = isPasswordCorrect(password)

    if (!checkpassword) {
        throw new ApisError(400, "please enter password")
    }

    const loggedInUser = await User.findById(user._id).select(
        "-pssword -refreshToken"
    )

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const options = {
        HttpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "Logged In Successfully"
        ))

})

const logOutUser = asyncHandler(async (req, res) => {
    //want user (add middleware to get user)
    //delete user;s refresh and accesstoken 
    // delete cookies of user
    const user = User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        HttpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", accessToken, options)
        .clearCookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {}, "users logged out successfully"))

})

export { registerUser, loginUser }