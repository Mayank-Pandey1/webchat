import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandlerjs";

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

    const existingUser = await User.findOne({ $or: [{fullName}, {email}] })
    if(existingUser) throw new ApiError(400, "User already exists")
})

export {registerUser}