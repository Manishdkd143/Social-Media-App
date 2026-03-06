const Post = require('../Models/post.model')
const Comment = require("../Models/comment.model")
const postComment = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { comment } = req.body;
    try {
        if (!userId) {
            throw new ApiError(401, "UnAuthorized ");
        }
        if (!postId) {
            throw new Api
        }
        if (!comment) {
            throw new ApiError(401, "comment is empty")
        }
       const commentONPost = await Post.findById(postId)
       commentONPost.Comment.push({
        userId,postId,comment
       })
        if(!commentONPost){
            throw new ApiError(500,"somthing happend while comment")
        }
        res.status(200,{commentONPost},"comment successfull")
    } catch (error) {
        throw new ApiError(400,"server Error ! try again")
    }
};
module.exports = postComment