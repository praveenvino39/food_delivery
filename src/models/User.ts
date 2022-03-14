import mongoose from 'mongoose';
import { Document, Schema, Model } from 'mongoose'
import { CreateVendorInput } from '../dto/Vendor.dto';


export interface UserDoc extends Document {
    name: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    country: string,
    picture: string
    countryCode: string;
    currency: string;
    city: string;
    userAddress: any;
    otpVerified: boolean;
    otp: string;
    orders: [string],
    cart: [any]
}

const UserSchema = new Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    otp: { type: Number, required: true },
    city: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'city'
    },
    picture: String,
    address: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'address'
    },
    cart: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'cart_item'
    }],
    userAddress: {type: mongoose.SchemaTypes.ObjectId, ref: 'address'},
    otpVerified: { type: Boolean, required: true },
    currency: { type: String, required: true },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password,
                delete ret.salt
        }
    },
    timestamps: true
});


const User = mongoose.model<UserDoc>('User', UserSchema);


export { User }