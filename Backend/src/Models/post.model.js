const { mongoose, Schema } = require("mongoose");
const postSchema=new Schema({
    userId:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
    title:{
        type:String
    },
    video:{
        type:String,
    },
    image:{
        type:String,
    },
    captions:{
      type:String,
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },
    likes:{
        type:Schema.Types.ObjectId,
        ref:"Like"
    }
},{timestamps:true})

const Post=mongoose.models.Post||mongoose.model("Post",postSchema);
module.exports=Post;
