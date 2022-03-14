import bodyParser from "body-parser";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { CreateFoodInput } from "../dto/Food.dto";
import { LoginVendorInput, UpdateVendorInput } from "../dto/Vendor.dto";
import { SendResponse } from "../middlewares";
import { Food, Vendor } from "../models";
import { Order } from "../models/Order";
import { CancelOrderInput } from '../dto/Vendor.dto'
import { GenerateToken, ValidatePassword } from "../utility";


//Login Vendor
export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <LoginVendorInput>req.body;
    //Checking post body has required params
    if (email && password) {
        const vendor = await Vendor.findOne({ email })

        // Checking vendor exist
        if (vendor) {
            //Checking password
            if (await ValidatePassword(password, vendor.password, vendor.salt)) {
                const token = await GenerateToken(req.body)
                return res.status(200).json(SendResponse(true, "Vendor login successfull", { token, vendor }))
            } else {
                return res.status(400).json(SendResponse(false, "Vendor email or password invalid", null))
            }
        }
    }
    return res.status(400).json(SendResponse(false, "Vendor not found", null))
}


//Get Vendor Profile
export const GetVendorDetail = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const vendor = await Vendor.findOne({ email: user.email })
        return res.status(200).json(SendResponse(true, "", vendor))
    }
    return res.status(401).json(SendResponse(false, "Request not Authorized", null))
}


//Update Vendor Profile
export const UpdateVendorDetail = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const { name, address, cusine, lat, long, phone, ownerName, pincode } = <UpdateVendorInput>req.body;
        const existingVendor = await Vendor.findOne({ email: user.email })
        if (existingVendor) {
            existingVendor.name = name ? name : existingVendor.name
            existingVendor.address = address ? name : existingVendor.name
            existingVendor.lat = lat ? lat : existingVendor.lat
            existingVendor.long = long ? long : existingVendor.long
            existingVendor.cusine = cusine ? cusine : existingVendor.cusine
            existingVendor.phone = phone ? phone : existingVendor.phone
            existingVendor.ownerName = ownerName ? ownerName : existingVendor.ownerName
            existingVendor.pincode = pincode ? pincode : existingVendor.pincode
            var savedVendor = await existingVendor.save()
            return res.status(200).json(SendResponse(true, "", savedVendor))
        }
    }
    return res.status(401).json(SendResponse(false, "Request not Authorized", null))
}


//Upload cover picture
export const UploadCoverPicture = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        try {
            if (req.files) {
                var images = (req.files as [Express.Multer.File]).map((file: Express.Multer.File) => file.filename)
                const vendor = await Vendor.findOne({ id: user._id })
                if (vendor) {
                    vendor.coverImages.push(...images)
                    const savedVendor = await vendor.save()
                    return res.status(200).json(SendResponse(true, "", savedVendor))
                }
            }
        } catch (e: any) {
            return res.status(200).json(SendResponse(false, e, null))
        }
    }
}

//Upload cover picture
export const UploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        try {
            if (req.file) {
                var image = (req.file as Express.Multer.File).filename
                const vendor = await Vendor.findOne({ id: user._id })
                if (vendor) {
                    vendor.picture = image
                    const savedVendor = await vendor.save()
                    return res.status(200).json(SendResponse(true, "", savedVendor))
                }
            }
            return res.status(200).json(SendResponse(false, "Picture field is allowed to be null", null))
        } catch (e: any) {
            return res.status(200).json(SendResponse(false, e, null))
        }
    }
}

//Update availablity
export const UpdateServiceAvailablity = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const { name, address, cusine, lat, long, phone, ownerName, pincode } = <UpdateVendorInput>req.body;
        const existingVendor = await Vendor.findOne({ email: user.email })
        if (existingVendor) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable
            var savedVendor = await existingVendor.save()
            return res.status(200).json(SendResponse(true, "", savedVendor))
        }
    }
    return res.status(401).json(SendResponse(false, "Request not Authorized", null))
}


//Create Food
export const CreateFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const vendor = await Vendor.findOne({ email: user.email })
        if (vendor) {
            const { name, description, category, price, readyTime, type } = <CreateFoodInput>req.body;
            if (name && description && category && price && readyTime && type) {
                var images = null
                if (req.file != null) {
                    images = (req.file as any as Express.Multer.File).filename
                }
                const food = await Food.create({
                    vendorId: vendor.id,
                    name,
                    description,
                    category,
                    image: images,
                    price,
                    rating: 0,
                    readyTime,
                    type,
                })
                vendor.foods.push(food)
                const savedVendor = await (await vendor.save()).populate("foods")
                return res.status(201).json(SendResponse(true, "Food added successfully.", food))
            }
        }
    }
    return res.status(401).json(SendResponse(false, "Request not Authorized", null))
}


//Get Foods
export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const vendor = await Vendor.findOne({ email: user.email })
        if (vendor) {
            const { foods } = await vendor.populate("foods")
            return res.status(200).json(SendResponse(true, "", foods))
        }
    }
    return res.status(401).json(SendResponse(false, "Request not Authorized", null))
}


//Get Food by ID
export const GetFoodByID = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        try {
            const food = await Food.findOne({ _id: req.params.id })
            return res.status(200).json(SendResponse(true, "", food))
        } catch {
            return res.status(200).json(SendResponse(true, "", []))
        }
    }
}



//Delete Food by ID
export const DeleteFoodByID = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        try {
            const food = await Food.findOne({ _id: req.params.id })
            if (food) {
                await food.remove()
                return res.status(200).json(SendResponse(true, "Food deleted successfully", food))
            }
            return res.status(200).json(SendResponse(false, "Food not found.", {}))
        } catch (e) {
            return res.status(200).json(SendResponse(true, `${e}`, []))
        }
    }
}


//Get Incomming orders
export const GetIncommingOrder = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const incommingOrders = await Order.find({ vendor_id: user._id, status: "ORDERED" }).populate({
            path: "cart",
            populate: [{
                path: "products", model: "cart_item", populate: { path: "product", model: "food" }
            },
            {
                path: "userID", model: "User",
            },
            {
                path: "vendorID", model: "vendor",
            }]
        })
        return res.status(200).json(SendResponse(true, ``, incommingOrders))
    }
}

//Get Cancelled orders
export const GetCancelledOrders = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const incommingOrders = await Order.find({ vendor_id: user._id, status: "CANCELLED" })
        return res.status(200).json(SendResponse(true, ``, incommingOrders))
    }
}

//Get current orders
export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const incommingOrders = await Order.find({ vendor_id: user._id, status: ["ACCEPTED", "READY"] })
        return res.status(200).json(SendResponse(true, ``, incommingOrders))
    }
}


//Accept Incomming orders
export const AcceptOrder = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const orderID = req.params.orderID
    if (user) {
        try {
            const order = await Order.findOne({ _id: orderID })
            if (!order) {
                return res.status(404).json(SendResponse(false, `Order not found`, order))
            }
            order.status = "ACCEPTED"
            await order.save()
            return res.status(200).json(SendResponse(true, `Order Accepted successfully`, order))
        } catch (e: any) {
            return res.status(400).json(SendResponse(false, `${e}`, null))
        }
    } else {
        return res.status(400).json(SendResponse(false, `User not Authorized`, null))
    }
}

//Ready to dispatch Incomming orders
export const ReadyToDispatchOrder = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const orderID = req.params.orderID
    if (user) {
        try {
            const order = await Order.findOne({ _id: orderID })
            if (!order) {
                return res.status(404).json(SendResponse(false, `Order not found`, order))
            }
            order.status = "READY"
            await order.save()
            return res.status(200).json(SendResponse(true, `Order moved to ready to dispatch`, order))
        } catch (e: any) {
            return res.status(400).json(SendResponse(false, `${e}`, null))
        }
    } else {
        return res.status(400).json(SendResponse(false, `User not Authorized`, null))
    }
}


//Cancel Incomming orders
export const CancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const { orderID, reason } = <CancelOrderInput>req.body
    if (user) {
        try {
            const order = await Order.findOne({ _id: orderID })
            if (!order) {
                return res.status(404).json(SendResponse(false, `Order not found`, order))
            }
            order.status = "CANCELLED"
            order.cancelReason = reason
            await order.save()
            return res.status(200).json(SendResponse(true, `Order Cancelled successfully`, order))
        } catch (e: any) {
            return res.status(400).json(SendResponse(false, `${e}`, null))
        }
    } else {
        return res.status(400).json(SendResponse(false, `User not Authorized`, null))
    }
}