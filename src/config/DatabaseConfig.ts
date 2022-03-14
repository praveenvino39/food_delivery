import mongoose, { Error } from "mongoose";
import { config } from 'dotenv'


config()

const ConnectToDatabase = async () => {
    var result = await mongoose.connect("mongodb+srv://pv4you:"+process.env.ATLAS_PASSWORD+"@cluster0.i6pr8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    if(result !== null){
        console.log("Connect to database");
    }else{
        console.log("Error occured")
    }
}


export {ConnectToDatabase}