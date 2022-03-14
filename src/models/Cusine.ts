import mongoose from "mongoose"
import { Schema, Document, Mongoose } from "mongoose"



export interface CusineDoc extends Document {
    name: string,
    status: boolean,
}

const CusineSchema = new Schema({
    name: {type: String, required: true},
    status: {type: Boolean, required: true, default: true}
})

const Cusine = mongoose.model<CusineDoc>("cusine",CusineSchema)

export {Cusine}
