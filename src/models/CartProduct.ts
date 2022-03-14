import mongoose, { Schema, Document } from "mongoose";




export interface CartProductDoc extends Document {
    _id: string;
    product: any;
    quantity: number;
}



const CartItemSchema = new Schema({
    product: {type: mongoose.SchemaTypes.ObjectId, ref: "food"},
    quantity: {type: Number, required:true}
})


const CartItem = mongoose.model<CartProductDoc>("cart_item", CartItemSchema)

export { CartItem }