import { User } from "../models/user.model.js"
import { ApiResponse } from "../utlis/ApiResponse.js"
import { ApisError } from "../utlis/ApisError.js"
import { asyncHandler } from "../utlis/asyncHandler.js"
import { FileUploadInCloudinary } from "../utlis/cloudinary.js"
import Jwt from "jsonwebtoken"


const generateRefreshAndAccessToken = async (userId) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new ApisError(400, "user not found")
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken()
    if (!accessToken && !refreshToken) {
        throw new ApisError(401, "token is not generated")
    }
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

}


const registerUser = asyncHandler(async (req, res) => {
    //get data
    //check having all data
    //check username or email if it is already exists
    //check images of avatar
    //upload image to cloudinary
    //create user
    //res.send
    const { email, fullname, username, password, } = req.body
    if ([email, fullname, username, password].some(field => field === "")) {
        throw new ApisError(400, "Fill all fileds")
    }
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existingUser) {
        throw new ApisError(400, "User already exists")
    }

    const localPathAvatar = req.files?.avatar[0]?.path;
    let localPathCoverImage;
    if (req.files && Array.isArray(req.files.localPathCoverImage) && req.files.coverImage[0].path) {
        localPathCoverImage = req.files.coverImage[0].path
    }
    if (!localPathAvatar) {
        throw new ApisError(400, "avatar missing")
    }

    const avatar = await FileUploadInCloudinary(localPathAvatar)
    const coverImage = await FileUploadInCloudinary(localPathCoverImage)

    if (!avatar) {
        throw new ApisError(400, "avatar missing")
    }
    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    const createUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createUser) {
        throw new ApisError(404, "User is not registered .Please try again")
    }

    res.status(200).json(new ApiResponse(200, "User created successfully"))

})


const login = asyncHandler(async (req, res) => {
    //check usrname or email is available
    //check password is correct or not 
    //generate refresh token and access token
    //check access and refresh token
    //res.send
    const { email, password, username } = req.body
    if (!email && !username) {
        throw new ApisError(400, "enter yout name or email")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApisError(401, "user not found")
    }

    const checkPassword = user.isPasswordCorrect(password)

    if (!checkPassword) {
        throw new ApisError(401, " password not correct")
    }
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,
            "login succesfuly",
            {
                user: loggedInUser, accessToken, refreshToken
            }
        ))
})

const logout = asyncHandler(async (req, res) => {
    //get user by middleware
    //remove refresh token
    //res.send
    const user = User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "logout successfully"))

})


const refreshAccesToken = asyncHandler(async (res, req) => {
    //if the access token will expire then ye can refresh our access Token by this matter 
    //because we want we dont login again and again so we create this method in which we refresh access token
    //get current token of user from cookies
    //decode the token
    //match decode token with real refreshToken save in env
    //generate new token 
    //res.status(200)
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApisError(401, "unauthorized refresh Token")
    }

    const decodeToken = Jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    if (!decodeToken) {
        throw new ApisError(401, "invalid token")
    }

    const user = await User.findById(decodeToken?._id)

    if (!user) {
        throw new ApisError(401, "invalid user ")
    }

    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApisError(404, "refresh token is expired or used")
    }
    const options = {
        httpOnly: true,
        secure: true,
    }

    const { accessToken, newRefreshToken } = await generateRefreshAndAccessToken(user._id)

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(200, "refreshToken successfully!", { accessToken, refreshToken: newRefreshToken }))
})

const currentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(200, "current User", { user: req.user })
})

const changepassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    if (!(oldPassword || newPassword)) {
        throw new ApisError(401, "enter both fields")
    }
    const user = await User.findById(req.user_id)
    if (!user) {
        throw new ApisError(401, "user not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApisError(401, "password incorrect")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, "password changed",))

})

const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, username } = req.body

    if (!fullname || !username) {
        throw new ApisError(400, "inter filed")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullname,
                username
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, "profile updated", user))
})

const updateAvatar = asyncHandler(async (req, res) => {
    const file = req.file?.path

    if (!file) {
        throw new ApisError(404, "the avatar filee is missing")
    }
    const avatar = await FileUploadInCloudinary(file)

    if (!avatar.url) {
        throw new ApisError(404, "the avatar not uploaded")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar?.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(200, "avatar changes successfully", user)
})


const updateCoverImage = asyncHandler(async (req, res) => {
    const file = req.file?.path

    if (!file) {
        throw new ApisError(404, "the avatar filee is missing")
    }
    const coverImage = await FileUploadInCloudinary(file)

    if (!coverImage.url) {
        throw new ApisError(404, "the avatar not uploaded")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(200, "coverImage changes successfully", user)
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const username = req.params

    if (!username?.trim()) {
        throw new ApisError(404, "User is not exits")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase(),
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: _id,
                foreignField: channel,
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: _id,
                foreignField: subscriber,
                as: "subscribersTo"
            }
        },
        {
            $addFields: {
                channelSubscriberCount: {
                    $size: "$subscribers"
                },
                subscribedChannelCount: {
                    $size: "$subscribersTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        }, {
            $project: {
                username: 1,
                email: 1,
                fullname: 1,
                avatar: 1,
                coverImage: 1,
                channelSubscriberCount: 1,
                subscribedChannelCount: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApisError(400, "invalid user channel")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "user channel Information"), channel[0])
})

export {
    registerUser,
    login,
    logout,
    refreshAccesToken,
    changepassword,
    currentUser,
    updateProfile,
    updateAvatar,
    updateCoverImage
}
