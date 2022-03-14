import mongoose from 'mongoose';
import { Document, Schema, Model } from 'mongoose'
import { CreateVendorInput } from '../dto/Vendor.dto';


export interface VendorDoc extends Document {
    name: string;
    ownerName: string;
    cusine: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    lat: number;
    long: number;
    serviceAvailable: boolean;
    coverImages: [string];
    rating: Number;
    foods: [any];
    city: any;
    country: string,
    countryCode: string;
    currency: string;
    enabled: boolean;
    picture: string;
    openingTime: string;
    closingTime: string;
    description: string;
    minimumPrice: number
}

const VendorSchema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    cusine: [String],
    pincode: String,
    address: String,
    lat: {type:Number, required: true},
    long: {type:Number, required: true},
    salt: { type: String, required: true },
    password:  { type: String, required: true },
    email: String,
    phone: String,
    coverImages: [String],
    rating: {type: Number},
    picture: {type: String},
    serviceAvailable: Boolean,
    images: [String],
    country: String,
    countryCode: String,
    currency: String,
    enabled: Boolean,
    openingTime: {type: String, required: true},
    closingTime: {type: String, required: true},
    description: {type: String, required: true},
    minimumPrice: {type: Number, required: true},
    city: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'city'
    },
    foods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food'
    }]
},{
    toJSON: {
        transform(doc, ret){
            delete ret.password,
            delete ret.salt
        }
    },
    timestamps: true
});


const Vendor = mongoose.model<VendorDoc>('vendor', VendorSchema);


export {Vendor}