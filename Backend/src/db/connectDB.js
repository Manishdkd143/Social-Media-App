const {mongoose}=require("mongoose")
export const ConnectDB = async()=>{
    try {
     const connectionInstance=   await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
     console.log(`Database Connected !! DB Host :${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("Connection Failed!",error)
    }
}
