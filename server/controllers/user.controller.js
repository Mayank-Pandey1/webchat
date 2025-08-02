import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating user and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // check validations - no fields are empty
    //check if user already exists
    //check for images - check for avatar
    //upload them to cloudinary, avatar
    // create user object, insert in db

    //remove password and refreshToken from response
    //return response
    //check if response is OK

    const {email, fullName, password, bio} = req.body   //req.body contains data when sent through forms or json format
    
    if([email, fullName, password, bio].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({email})
    if(existingUser) throw new ApiError(400, "User already exists")

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword, 
        bio
    })

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken")
    if(!createdUser) throw new ApiError(500, "Something went wrong while registering the user")
    
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(createdUser._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(new ApiResponse(200, {user: createdUser}, "New user created"))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    if(!email) throw new ApiError(400, "email not found")

    const user = await User.findOne({ email })
    if(!user) throw new ApiError(404, "User doesn't exist")

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) throw new ApiError(401, "Invalid user credentials")

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
              .cookie("accessToken", accessToken, options)     //send the cookies to frontend and axios will use this 
              //Axios helps your frontend make API calls to your backend, and:
            //Automatically includes the cookies (with tokens) only if you tell it to do so
              .cookie("refreshToken", refreshToken, options)
              .json(new ApiResponse(200, {user: loggedInUser}, "User logged in successfully"))
})

const updateProfile = asyncHandler(async (req, res) => {
    const { bio, fullName } = req.body;

    let profileImage;
    if(req.file?.path) {
        const profileImageLocalPath = req.file?.path
        profileImage = await uploadOnCloudinary(profileImageLocalPath)
        if(!profileImage?.url) throw new ApiError("Error while upload on cloudinary")
    }
    
    const updateData = {};

    if (fullName) updateData.fullName = fullName.trim();
    if (bio) updateData.bio = bio.trim();
    if(profileImage?.url) updateData.profilePic = profileImage?.url
    
    const user = await User.findByIdAndUpdate(req.user._id, 
                                            {$set: updateData}, 
                                            {new: true})
    if(!user) throw new ApiError(500, "Error while updating user profile")
    
    return res.status(200)
                .json(new ApiResponse(200, {updateData}, "User profile update success"))
})

const logoutUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        if (userId) {
            await User.findByIdAndUpdate(userId, { refreshToken: "" });
        }
    } catch (err) {
        console.warn("Error clearing refresh token from DB", err.message);
    }

    // Clear cookies on client
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User logged out successfully"));
})

export {registerUser, loginUser, updateProfile, logoutUser}