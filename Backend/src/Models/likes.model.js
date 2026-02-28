const { Schema, mongoose } = require("mongoose");

const likeSechema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    
  },
  { timestamps: true },
);

const like = mongoose.models.likes || mongoose.models("Like", likeSechema);
module.exports = like
