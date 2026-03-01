const { Schema , mongoose} = reuqire('mongoose')

const followsSchema = new Schema({
    follower:{
       userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true,
          }
    },
    followings:{
         userId: {
              type: Schema.Types.ObjectId,
              ref: "User",
              require: true,
            },
    }
})


const follows = mongoose.model.follows || mongoose.model("follow",followsSchema);
module.exports = follows

