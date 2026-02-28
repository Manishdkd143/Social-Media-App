const { Schema, default: mongoose } = require("mongoose");

const messageSchema=new Schema({
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    chatId:{
        type:Schema.Types.ObjectId,
        ref:"Chat",
        require:true,
    },
    content:{
        type:String,
        require:true,
    }

},
{timestamps:true});
const Message=mongoose.models.Message||mongoose.model("Message",messageSchema);
module.exports=Message;