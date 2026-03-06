const { default: mongoose } = require("mongoose");
const ApiError = require("../helpers/ApiError");
const ApiResponse = require("../helpers/ApiResponse");
const {uploadFileOnCloudinary,deleteFileOnCloudinary} = require("../helpers/Cloudinary");
const Post = require("../Models/post.model");

const createPost = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized user!please login");
    }
    let videos=[];
    let images = [];
    const { captions } = req.body;
    if (!captions) {
      throw new ApiError(400, "caption is required!");
    }
    const files = req?.files;
    files.forEach((file) => {
      if (file.memeType.startsWith("image")) {
        images.push(file.path);
      } else if (file.memeType.startsWith("video")) {
        videos = file.path;
      }
    });
    if (images.length > 0) {
      const imageUrls = await Promise.all(
        images.map(async (url) => {
          const result = await uploadFileOnCloudinary(url,"posts");
          return {
            url:result.secure_url,
            public_id:result.public_id,
          };
        })
      );
      if(!imageUrls||imageUrls.length===0)throw new ApiError(400,"Images uploading failed!")
      else images = imageUrls;
    }
   if (videos.length > 0) {
      const videoUrls = await Promise.all(
        videos.map(async (url) => {
          const result = await uploadFileOnCloudinary(url,"posts");
          return {
            url:result.secure_url,
            public_id:result.public_id,
          };
        })
      );
       if(!videoUrls||videoUrls.length===0)throw new ApiError(400,"Videos uploading failed!")
      else videos = videoUrls;
    }
    const newPost= await Post.create({
      userId:user._id,
      videos,
      images,
      captions,
     })
    if(!newPost)throw new ApiError(400,"Post creation failed!")
      return res.status(201).json(new ApiResponse(201,{post:newPost},"Post created successfully"))
  } catch (error) {
    throw new ApiError(500, error?.message || "Post creation failed!");
  }
};
const deletePost=async(req,res)=>{
  try {
    const user=req.user;
    if(!user)throw new ApiError(401,"Unauthorized user!");
    const {postId}=req.params;
    if(!postId||!mongoose.isValidObjectId(postId)){
      throw new ApiError(400,"Invalid postId or post!")
    }
   const post= await Post.findById(postId);
   if(!post)throw new ApiError(404,"Post not found!");
    if(post.images.length>0){
      for(const img of post.images){
        await deleteFileOnCloudinary(img?.public_id)
      }
    }
    if(post.videos.length>0){
      for(const video of post.videos){
        await deleteFileOnCloudinary(video?.public_id)
      }
    }
    if(post.images.length!==0||post.videos.length!==0){
      throw new ApiError(400,"cloud deletion failed!")
    }
    const deletePost=await Post.deleteOne({_id:post._id})
    if(!deletePost){
      throw new ApiError(404,"Post deletion failed!")
    }
   return res.status(200).json(new ApiResponse(200,{},"Post successfully deleted"))
  } catch (error) {
    throw new ApiError(500,error?.message||"Post deleted failed!")
  }
}
module.exports={
  createPost,
  deletePost,
}
