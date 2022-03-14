import { Request } from "express"
import multer from "multer"

const imageStratergy = multer.diskStorage({
    destination: (req:Request, file:Express.Multer.File, cb)=>{
        cb(null,"src/images")
    },
    filename: (req:Request, file:Express.Multer.File, cb)=>{
        cb(null,  Math.floor((Math.random()*1000)) + "." + file.originalname.split(".")[file.originalname.split(".").length - 1])
    }
}) 

const foodImages = multer({storage: imageStratergy}).single("foodImages")


const uploadVendorCoverImage = multer({storage: imageStratergy}).array("coverImages", 2)
const uploadVendorPictureImage = multer({storage: imageStratergy}).single("picture")

const vendorImages = multer({storage: imageStratergy}).fields([{ name: "coverImages",maxCount: 10},{ name: "picture",maxCount: 1}])



export {foodImages, vendorImages, uploadVendorCoverImage, uploadVendorPictureImage}