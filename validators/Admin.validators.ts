import { Joi } from "express-validation";

export const ValidateCreateCity = {
    body: Joi.object({
        name: Joi.string()
            .required(),
        country: Joi.string()
            .required(),
        countryCode: Joi.string()
            .required(),
    })
}