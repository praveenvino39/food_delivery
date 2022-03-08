import express, { NextFunction, Request, Response } from 'express'
import { validate } from 'express-validation';
import { AllCities, AllCountries, CreateCity, CreateVendor, GetVendor, GetVendorByID, SwitchVendorAvailablity } from '../controllers';
import { vendorImages } from '../helpers/UploadHelper';
import { ValidateCreateVendor } from '../validators';
import { ValidateCreateCity } from '../validators/Admin.validators';


const router = express.Router();

router.get("/country", AllCountries)
router.get("/city", AllCities)
router.post("/city", validate(ValidateCreateCity, {keyByField: true}, {}), CreateCity)
router.post("/vendor", vendorImages , validate(ValidateCreateVendor, { keyByField: true }, { }), CreateVendor)
router.get("/vendor", GetVendor)
router.patch("/vendor/switch/:id", SwitchVendorAvailablity)
router.get("/vendor/:id", GetVendorByID)

export { router as AdminRoutes }