const { mongoose, Schema } = require("mongoose");
const userSchema = new Schema({
  username: {
    type: String,
    require:true, 
  },
  email: {
    type: String,
    require:true, 
    unique:true
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
  },
  bio: {
    type: String,
    require:true, 
  },
  avatarUrl: {
    type: String,
    require:true, 
  },
},{timestamps:true}
);
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;