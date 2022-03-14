import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose'


export interface InvoiceDoc extends Document {
    userID: string;
    cartID: string;
    taxPercentage: number;
    taxAmount: number;
    payable: number;
    promocodeDiscount: number;
    deliveryCharge: number;
}

const InvoiceSchema = new Schema({
    userID: { type: String, required: true },
    cartID: { type: String, required: true },
    taxPercentage: {type: Number, required: true},
    taxAmount: {type: Number, required: true},
    promocodeDiscount: {type: Number, required: false},
    deliveryCharge: {type: Number, required: false},
    payable: {type: Number, required: true}
}, {
    timestamps: true
});


const Invoice = mongoose.model<InvoiceDoc>('invoice', InvoiceSchema);


export { Invoice }