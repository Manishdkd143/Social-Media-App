const { options } = require("../app");
const ApiError = require("../helpers/ApiError");
const ApiResponse = require("../helpers/ApiResponse");
const User = require("../Models/user.model");
const bcrypt = require("bcrypt");

const generatedAccessTokenAndRefreshToken=async(userId)=>{
try {
    const user=await User.findById(userId).select(-password);
    if(!user)throw new ApiError(401,"Unauthorized user!");
    const accessToken=await user.generatedAccessToken();
    const refreshToken=await user.generatedRefreshToken();
    if(!accessToken||!refreshToken)throw new ApiError(400,"Token generated failed!")
    user.refreshToken=refreshToken;
   await user.save({validateBeforeSave:true});
   return {accessToken,refreshToken}
} catch (error) {
    throw new ApiError(400,error?.message||"Token generated failed!")
}
}
const UserRegister = async (req, res) => {
    const { username, email, password, mobileNumber, fullName, bio, avatarUrl } =
        req.body;
    const exists = await User.findOne({ email });
    if (exists) {
        throw new ApiError(401, "User already exists!");
    }
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
            username,
            email,
            password: hashPassword,
            mobileNumber,
            fullName,
            bio,
            avatarUrl,
        }).select("-password")
        if (!createdUser) {
            throw new ApiError(400, "User creation failed!")
        }
        res.status(201).json(new ApiResponse(201, { data: createdUser }, "User created successfully"));
        console.log(createdUser);
    } catch (error) {
       throw new ApiError(400,error?.message||"User registration failed!")
    }
};
const userLogin=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email)throw new ApiError(400,"Email is required!")
        if(!password)throw new ApiError(400,"password is required!");
        const loginUser = await User.findOne({email})
        if(!loginUser){
            throw new ApiError(404,"User not found");
        }
        const isPassValid = loginUser.isPasswordCorrect(password);
        if(!isPassValid ){
            throw new ApiError(401,"invalid password")
        }
        const {accessToken,refreshToken}=await generatedAccessTokenAndRefreshToken(loginUser);
        if(!accessToken||!refreshToken)throw new ApiError(400,"Token generated failed!");
        const options={
            httpOnly:true,
            secure:true,
        }
        return res.status(200).
         cokkie("accessToken",accessToken,options).
         cokkie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200,{
            user:loginUser,accessToken,refreshToken
        },"User login successfully"
))
    } catch (error) {
        throw new ApiError(401,"User login failed!");
    };
}
const logOut = async(req,res)=>{
    
    try {
        const user=req.user
        if(!user)throw new ApiError(500,"User Not LoggedIn!");
        await User.findByIdAndUpdate(user._id,
            {
                $set:{
                    refreshToken:undefined,
                },
            },
            {new:true},
        )
        const options={
            httpOnly:true,
            secure:true,
        }
         return res.status(200).
         clearCokkie("accessToken",options).
         clearCokkie("refreshToken",options).
         json(new ApiResponse(200,{},"User logout successfully"))
    } catch (error) {
        throw new ApiError(400,"User logout failed!")
    }
}
module.exports = { UserRegister, userLogin, logOut };

