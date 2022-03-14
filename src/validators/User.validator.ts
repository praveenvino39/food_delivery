// name: { type: String, required: true },
// phone: { type: String, required: true },
// email: { type: String, required: true },
// password:  { type: String, required: true },
// salt: { type: String, required: true },
// country: { type: String, required: true },
// countryCode: { type: String, required: true },
// otp: { type: Number, required: true },
// city: {
//     type: mongoose.SchemaTypes.ObjectId,
//     ref: 'city'
// },
// picture: String,
// adress: {
//     type: mongoose.SchemaTypes.ObjectId,
//     ref: 'address'
// },
// otpVerified: { type: Boolean, required: true },
// currency: { type: String, required: true },

import { Joi } from "express-validation";



export const ValidateCreateUser = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        country: Joi.string().required(),
        countryCode: Joi.string().required(),
        currency: Joi.string().required(),
        city: Joi.string().required()
    })
}



export const ValidateVerifyOtp = {
    body: Joi.object({
        otp: Joi.string().required(),
        email: Joi.string().email().required(),
    })
}

export const ValidateLogin = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
}

export const ValidateAddAdress = {
    body: Joi.object({
        doorNo: Joi.string().required(),
        address: Joi.string().required(),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        pincode: Joi.string()
    })
}

export const ValidateAddtoCart = {
    body: Joi.object({
        productID: Joi.string().required(),
        quantity: Joi.number()
    })
}


export const ValidateCheckout = {
    body: Joi.object({
        paymentMode: Joi.string().required(),
        note: Joi.string(),
        paymentID: Joi.string(),
    })
}