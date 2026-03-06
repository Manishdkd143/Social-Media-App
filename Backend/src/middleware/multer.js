const multer=require("multer");
const storage= multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,"public/")
    },
    filename:function(req,file,cb){
    cb(null,Date.now()+"-"+file.filename);
    }
})
const Upload=multer({storage})
const uploadMediaFiles=Upload.array("media",5)
module.exports={Upload,uploadMediaFiles};