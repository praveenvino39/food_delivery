import mongoose from 'mongoose';
import { Document, Schema } from 'mongoose'


export interface OrderDoc extends Document {
    user: any;
    vendor: any;
    paymentMode: string;
    paymentID: string;
    cart: any;
    status: string;
    itemTotal: string;
    taxAmount:number;
    taxPercentage: number;
    payable:number;
    deliveryCharge:number;
    rating: number;
    currencyCode: string;
    paymentResponse: string;
    note:string;
    cancelReason:string
}

const OrderSchema = new Schema({
    status: {type: String, required:true, enum: ["ORDERED", "ACCEPTED", "READY", "ARRIVED", "PICKEDUP", "REACHED", "DELIVERED", "COMPLETED", "CANCELLED"], default: "ORDERED"},
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    vendor: { type: mongoose.SchemaTypes.ObjectId, ref: "vendor", required: true },
    cart: {type: Object, required: true},
    note: {type: String},
    itemTotal: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    payable: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    currencyCode: { type: String, required: true },
    taxPercentage: { type: Number, required: true },
    rating: { type: Number, required: false },
    paymentMode: {type: String, required: true, enum: ["ONLINE", "COD"]},
    paymentID: {type:String},
    paymentResponse: {type:String},
    cancelReason: {type:String}
}, {
    timestamps: true
});


const Order = mongoose.model<OrderDoc>('order', OrderSchema);


export { Order }