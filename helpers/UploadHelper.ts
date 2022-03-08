import { Request } from "express"
import multer from "multer"

const imageStratergy = multer.diskStorage({
    destination: (req:Request, file:Express.Multer.File, cb)=>{
        cb(null,"images")
    },
    filename: (req:Request, file:Express.Multer.File, cb)=>{
        cb(null,  Math.random() + file.originalname)
    }
}) 

const foodImages = multer({storage: imageStratergy}).array("foodImages", 10)


const vendorImages = multer({storage: imageStratergy}).array("vendorImages", 10)

const uploadVendorImage = multer({storage: imageStratergy}).array("vendorImages", 1)



export {foodImages, vendorImages, uploadVendorImage}