import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async(req,res) => {
        //    get user details from frontend
        //    validation -not empty
        //    check if user already exist: email,username
        //    check for images,check for avatar
        //    upload them to cloudinary,avatar
        //    create user object-crate enter in db
        //    remove password and refersh token field from response
        //    check for user creation
        //    return res

        const {fullName,email,username,password} = req.body
        console.log("email:",email);

        if ([fullName,email,username,password].some((field)=>
                field?.trim() === "")
                ){
                throw new ApiError(400,"all fields are required")
        }

        const existedUser = User.findOne({
                $or : [{username},{email}]
        })

        if(existedUser){
                throw new ApiError(409,"user with email or username already exista")
        }

        const avtarLocalPath = req.files?.avtar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if (!avtarLocalPath){
                throw new ApiError(400,"Avtar file is required")
        }

        const avtar = await uploadOnCloudinary(avtarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if (!avtar){
                throw new ApiError(400,"Avtar file is required")
        }

        const user = await User.create({
                fullName,
                avtar:avtar.url,
                coverImage: coverImage?.url || "",
                email,
                password,
                username: username.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select(
                "-password-refershToken")

        if (!createdUser){
                throw new ApiError(500,"something went wrong while registering user")
        }

        return res.status(201).json(
                new ApiResponse(200), createdUser,"User registered sucessfully"
        )




})

export {
        registerUser,
}