const { default: mongoose } = require("mongoose");
const ApiError = require("../helpers/ApiError");
const ApiResponse = require("../helpers/ApiResponse");

const createComment = async (req, res) => {
  const user = req.user;
  const postId = req.params.postId;
  const { comment } = req.body;
  try {
    if (!user) {
      throw new ApiError(401, "UnAuthorized ");
    }
    if (!postId || !mongoose.isValidObjectId(postId)) {
      throw new ApiError(400, "Invalid postId!");
    }
    if (!comment) {
      throw new ApiError(400, "comment is empty");
    }
    const newComment = await Comment.create({
      userId: user._id,
      content,
      post: postId,
    });
    if (!newComment) {
      throw new ApiError(400, "Failed to create Comment");
    }
    res.status(201).json(new ApiResponse(201,newComment,"Comment created successfully"))
  } catch (error) {
    throw new ApiError(500, "server Error ! try again");
  }
};
module.exports = createComment;
