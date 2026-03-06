//to do cloudinary config 
const Cloudinary = require('cloudinary').v2;
const fs=require("fs/promises");
// cloudinary.config({
//   cloud_name: 'your_cloud_name',
//   api_key: 'your_api_key',
//   api_secret: 'your_api_secret'
// });   

const ApiError = require("./ApiError")

const uploadFileOnCloudinary=async(localFilePath,folderName)=>{
    
    try {
        if(!localFilePath)throw new ApiError(404,"local file path required");
        const response=await Cloudinary.uploader.upload(localFilePath,
            {
                resource_type:"auto",
                folder:folderName,
            }
        )
        fs.unlinkSync(localFilePath);
        return  response
    } catch (error) {
        throw new ApiError(500,error?.message||"Cloudinary connection failed!try again")
    }
}
const deleteFileOnCloudinary=async(public_id)=>{
    try {
        if(!public_id)throw new ApiError(400,"Public id required!");
        const res=  await Cloudinary.uploader.destroy(public_id,{
                resource_type:"auto",
        })
        return res;
    } catch (error) {
        throw new ApiError(500,"Cloudinary connection failed!try again")
    }
}
module.exports={uploadFileOnCloudinary,deleteFileOnCloudinary};