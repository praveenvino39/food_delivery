import mongoose from "mongoose"
import { Schema, Document, Mongoose } from "mongoose"



export interface CityDoc extends Document {
    name: string,
    country: string,
    countryCode: string,
}

const CitySchema = new Schema({
    name: {type: String, required: true},
    country: {type: String, required: true},
    countryCode: {type: String, required: true}
})

const City = mongoose.model<CityDoc>("City",CitySchema)

export {City}
