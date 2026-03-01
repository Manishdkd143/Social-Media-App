const ApiError = require("../helpers/ApiError");
const jwt=require("jsonwebtoken");
const User = require("../Models/user.model");
const verifyJWT=async(req,res,next)=>{
    try {
        const token=req?.cookies.accessToken||req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(401,"Unauthorized user!please login")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(!decodedToken){
            throw new ApiError(401,"Invalid access token!")
        }
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(404,"User not found!")
        }
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(400,error?.message||"User not verified!")
    }
}
module.exports=verifyJWT;