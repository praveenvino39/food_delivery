import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose'


export interface CartDoc extends Document {
    userID: string;
    vendorID: string;
    products: [any];

}

const CartSchema = new Schema({
    userID: { type: String, required: true },
    vendorID: { type: String, required: true },
    products: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'cart_item',
        },
    ]
}, {
    timestamps: true
});


const Cart = mongoose.model<CartDoc>('cart', CartSchema);


export { Cart }