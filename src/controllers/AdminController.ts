import { Request, Response, NextFunction } from 'express'
import { CreateVendorInput } from '../dto/Vendor.dto';
import { SendResponse } from '../middlewares';
import { Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';
import { Country } from "country-state-city"
import { CreateCityInput } from '../dto/Admin.dto';
import { City, CityDoc } from '../models/City';
import { CreateCusineInput } from '../dto/Food.dto';
import { Cusine } from '../models/Cusine';







//Get All Countries
export const AllCountries = async (req: Request, res: Response, next: NextFunction) => {
    const countries = Country.getAllCountries()
    return res.status(200).json(SendResponse(true, "", countries))
}

//Get All City
export const AllCities = async (req: Request, res: Response, next: NextFunction) => {
    const countryCode = req.query.country
    if (!countryCode) {
        return res.status(400).json(SendResponse(false, "Country is required.", null))
    }
    const cities = await City.find({ countryCode })
    return res.status(200).json(SendResponse(true, "", cities))
}


//Create City
export const CreateCity = async (req: Request, res: Response, next: NextFunction) => {
    const { name, country, countryCode } = <CreateCityInput>req.body;

    const existingCity = await City.find({ name: name.toLowerCase() })
    if (existingCity.length != 0) {
        return res.status(400).json(SendResponse(false, "City already exist.", null))
    }
    const city = await City.create({
        name: name.toLowerCase(), country, countryCode
    })
    return res.status(200).json(SendResponse(true, "City added successfully", city))
}


//Create New Vendor
export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { name, ownerName, cusine, pincode, address, email, password, phone, lat, long, countryCode, country, currency, cityID, openingTime, closingTime, description, minimumPrice } = <CreateVendorInput>req.body;


    //Check city is valid
    var city: any = null
    try {
        city = await City.findOne({ _id: cityID })
        if (!city) {
            return res.status(400).json(SendResponse(false, "City not available", null))
        }
    } catch {
        return res.status(400).json(SendResponse(false, "City not available", null))
    }

    //Checking existing vendor
    const existingVendor = await Vendor.findOne({ email })
    if (existingVendor !== null) {
        return res.status(400).json(SendResponse(false, "Vendor already exist", []))
    }


    //Generating encrypted password
    const salt = await GenerateSalt()
    const encryptedPassword = await GeneratePassword(password, salt)

    //Images
    var imageFiles: Array<string> = []
    var profilePicture = null

    //Uploading Files
    if (req.files != null) {

        //Profile picture: String
        if ((req.files as any)["picture"]) {
            profilePicture = (req.files as any)["picture"][0].filename
        }

        //Cover pictures : List
        if ((req.files as any)["coverImages"]) {
            imageFiles = ((req.files as any)["coverImages"] as [Express.Multer.File]).map((file: Express.Multer.File) => file.filename)
        }
    }

    var closingTimeFormated = new Date()
    var openingTimeFormated = new Date()
    try {
        closingTimeFormated = new Date(2020, 1, 1, Number.parseInt(closingTime.split(":")[0]), Number.parseInt(closingTime.split(":")[1]), 1)
        openingTimeFormated = new Date(2020, 1, 1, Number.parseInt(openingTime.split(":")[0]), Number.parseInt(openingTime.split(":")[1]), 1)
    } catch (e: any) {
        return res.status(400).json(SendResponse(false, "opening and closing time", null))
    }

    //Creating Vendor
    const createdVendor = await Vendor.create({
        name,
        ownerName,
        cusine,
        pincode,
        address,
        email,
        password: encryptedPassword,
        phone,
        lat,
        long,
        picture: profilePicture,
        country,
        countryCode,
        currency,
        coverImages: imageFiles,
        serviceAvailable: false,
        rating: 0,
        salt: salt,
        enabled: false,
        closingTime: closingTimeFormated.toUTCString(),
        openingTime: openingTimeFormated.toUTCString(),
        description,
        minimumPrice,
        city: city
    })
    return res.status(201).json(SendResponse(true, "Vendor created successfully.", createdVendor))
}




//Get all Vendors
export const GetVendor = async (req: Request, res: Response, next: NextFunction) => {
    const vendors = await Vendor.find()
    return res.status(200).json(SendResponse(true, "", vendors))
}

//Get Vendors by id
export const SwitchVendorAvailablity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = await Vendor.findById(req.params.id)
        if (vendor) {
            vendor.enabled = !vendor.enabled
            vendor.save()
            return res.status(200).json(SendResponse(true, "", vendor !== null ? vendor : []))
        } else {
            return res.status(200).json(SendResponse(false, "Vendor not found", []))
        }
    } catch {
        return res.status(400).json(SendResponse(false, "Invalid id", []))
    }
}


//Get Vendors by id
export const GetVendorByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = await Vendor.findById(req.params.id)
        return res.status(200).json(SendResponse(true, "", vendor !== null ? vendor : []))
    } catch {
        return res.status(400).json(SendResponse(false, "Invalid id", []))
    }
}


//Get Create cusine
export const CreateCusine = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = <CreateCusineInput>req.body;
    const isCusineExist = await Cusine.findOne({ name:name.toLowerCase() })
    if (isCusineExist) {
        return res.status(400).json(SendResponse(false, "Cusine already exist", null))
    }
    const cusine = await Cusine.create({
        name:name.toLowerCase()
    })
    return res.status(201).json(SendResponse(true, "Cusine created successfully", cusine))
}

//Get cusine list
export const GetAllCusine = async (req: Request, res: Response, next: NextFunction) => {
    const cusine = await Cusine.find()
    return res.status(201).json(SendResponse(true, "", cusine))
}
