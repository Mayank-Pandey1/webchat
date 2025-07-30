import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    fullName: {type: String, required: true, minLength: 6},
    password: {type: String, required: [true, "Password is required"], minLength: 6},
    profilePic: {type: String, default: ""},
    bio: {type: String},
    refreshToken: {type: String}
}, {timestamps: true})

//creating new methods of generating tokens
userSchema.methods.generateAccessToken = function () {   //jwt.sign takes 3 parameters - payload, token-Secret and Expiry
    return jwt.sign({
        _id: this._id,
        email: this.email,
        fullName: this.fullName
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
}

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema)