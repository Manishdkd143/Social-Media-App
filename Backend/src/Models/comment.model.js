const { Schema, default: mongoose, pluralize } = require("mongoose");
const commentSchema=new Schema({
   userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    require:true,
   },
    content:{
        type:String,
        require:true,
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:"Post",
    },
    commentLike:{
        type:Schema.Types.ObjectId,
        ref:"Like"
    }

},{timestamps:true})
const Comment=mongoose.models.Comment||mongoose.model("Comment",commentSchema);
module.exports=Comment;

