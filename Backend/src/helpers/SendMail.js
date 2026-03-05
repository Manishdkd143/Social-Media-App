const nodemailer=require("nodemailer");
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.SITE_GMAIL,
        pass:process.env.SITE_GMAIL_PASS,
    }
})
module.exports=transporter;