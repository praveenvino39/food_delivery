import mongoose from "mongoose";
import { Document, Schema, Mongoose } from "mongoose";


export interface AddressDoc extends Document {
    userID: string,
    doorNo: string,
    address: string,
    lat: number,
    long: number
}


const AddressSchema = new Schema({
    userID: { type: String, required: true },
    doorNo: { type: String, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
})


const Address = mongoose.model("address", AddressSchema)

export { Address }