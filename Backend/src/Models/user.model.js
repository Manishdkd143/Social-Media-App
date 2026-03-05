const { mongoose, Schema } = require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const userSchema = new Schema({
  username: {
    type: String,
    require:true, 
    lowercase:true,
  },
  email: {
    type: String,
    require:true, 
    unique:true,
    lowercase:true,
  },
  password: {
    type: String,
    require:true, 
  },
  mobileNumber:{
    type:number,
    require:true,
    unique:true,
    limit:10
  },
  fullName: {
    type: String,
    require:true, 
    lowercase:true,
  },
  bio: {
    type: String,
    require:true, 
   lowercase:true,
  },
  avatarUrl: {
    type: String,
  },
  refreshToken:{
    type:String,
  }
},{timestamps:true}
);
userSchema.methods.generatedAccessToken= function () {
  return jwt.sign({
    _id:this._id,
    email:this.email,
    userName:this.userName,
    fullName:this.fullName,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
  }
)
}
userSchema.methods.generatedRefreshToken=function(){
  return jwt.sign({
    _id:this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
  }
)
}
userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(this.password,password);
}
userSchema.pre("save",async function(password) {
  if(!this.isModified("password"))return next();
  this.password=await bcrypt.hashSync(password,10);
  next();
})
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;