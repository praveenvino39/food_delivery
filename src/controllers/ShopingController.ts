import { NextFunction, Request, Response } from "express";
import { vendorImages } from "../helpers/UploadHelper";
import { SendResponse } from "../middlewares";
import { Food, FoodDoc, Vendor, VendorDoc } from "../models";

export const GetAllVendor = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.query.pincode
    if (pincode) {
        const vendors = await Vendor.find({ pincode, serviceAvailable: true }).sort([['rating', 'descending']])
        return res.status(200).json(SendResponse(true, "", vendors))
    }
    return res.status(400).json(SendResponse(false, "Pincode is required", null))
}


export const GetAllFoods = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.query.pincode
    if (pincode) {
        var foods: Array<FoodDoc> = []
        const vendors = await Vendor.find({ pincode: pincode, serviceAvailable: true }).sort([['rating', 'descending']]).populate("foods")
        vendors.map((vendor: VendorDoc) => foods.push(...vendor.foods))
        return res.status(200).json(SendResponse(true, "", foods))
    }
    return res.status(400).json(SendResponse(false, "Pincode is required", null))
}


export const SearchVendor = async (req: Request, res: Response, next: NextFunction) => {
    const search = req.query.search
    if (search) {
        const vendors = await Vendor.find({ name: { $regex: search, $options: 'i', serviceAvailable: true } })
        return res.status(200).json(SendResponse(true, "", vendors))
    }
    return res.status(400).json(SendResponse(false, "Search is required", null))
}

export const SearchFood = async (req: Request, res: Response, next: NextFunction) => {
    const search = req.query.search
    if (search) {
        const foods = await Food.find({ name: { $regex: search, $options: 'i' } })
        return res.status(200).json(SendResponse(true, "", foods))
    }
    return res.status(400).json(SendResponse(false, "Search is required", null))
}

export const FoodReadyIn30Minute = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.query.pincode
    if (!pincode) {
        return res.status(400).json(SendResponse(false, "Pincode is required", null))
    }
    const vendors = await Vendor.find({ pincode }).populate("foods")
    if (vendors.length > 0) {
        const foods: Array<FoodDoc> = []
        vendors.map((vendor: VendorDoc) => {
            foods.push(...vendor.foods.filter(food => food.readyTime <= 30))
        })
        return res.status(200).json(SendResponse(true, "", foods))
    }
    return res.status(200).json(SendResponse(true, "", []))
}