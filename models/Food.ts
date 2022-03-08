import mongoose, { Schema, Document } from "mongoose";




export interface FoodDoc extends Document {
    name:string;
    description:string;
    price:number;
    category:string;
    type:string;
    rating:number;
    readyTime:number;
    image:[string];
    vendorId: string;
}



const FoodSchema = new Schema({
    vendorId: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    type: {type: String, required: true},
    readyTime: {type: Number, required: true},
    image: [{type: String, required: true}],
    rating: {type: Number, required: true}
})


const Food = mongoose.model<FoodDoc>("food", FoodSchema)

export {Food}