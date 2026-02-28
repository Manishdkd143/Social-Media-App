const express=require("express");
const cookieParser=require("cookie-parser")
const app=express();
app.use(express.json({limit:"16kb"}))
app.use(cors({}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())

module.exports=app;