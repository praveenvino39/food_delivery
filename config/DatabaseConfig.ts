import mongoose, { Error } from "mongoose";



const ConnectToDatabase = async () => {
    var result = await mongoose.connect("mongodb://127.0.0.1:27017/mydb")
    if(result !== null){
        console.log("Connect to database");
    }else{
        console.log("Error occured")
    }
}


export {ConnectToDatabase}