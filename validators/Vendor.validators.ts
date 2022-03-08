import { validate, ValidationError, Joi } from "express-validation"

export const ValidateCreateVendor = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        name: Joi.string().required(),
        cusine: Joi.array().required(),
        ownerName: Joi.string().required(),
        pincode: Joi.string().required(),
        address: Joi.string().required(),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        phone: Joi.string().required(),
        password: Joi.string().required(),
        country: Joi.string().required(),
        countryCode: Joi.string().required(),
        currency: Joi.string().required(),
        cityID: Joi.string().required()
    })
}


export const ValidateUploadCover = {
    body: Joi.object({
        vendorImages: Joi.string()
            .required()
    })
}

