const { Schema , mongoose} = require('mongoose')

const followsSchema = new Schema({
    follower:{
       userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true,
          }
    },
    following:{
         userId: {
              type: Schema.Types.ObjectId,
              ref: "User",
              require: true,
            },
    }
})


const Follow = mongoose.models.Follow || mongoose.model("Follow",followsSchema);
module.exports = Follow

