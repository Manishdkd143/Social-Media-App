const app=require("./app");
const { ConnectDB } = require("./db/connectDB");
ConnectDB().
then(()=>{
app.on('error',(err)=>{
console.log("Connection Failed!",err);
})
app.listen((PORT)=>{
    console.log(`App is running on Port: ${PORT}`)
})
}).catch(err=>{
    console.error("Error",err)
})