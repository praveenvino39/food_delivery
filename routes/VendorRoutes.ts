import express, { NextFunction, Request, Response } from 'express'
import { validate } from 'express-validation';
import multer from 'multer';
import { CreateFood, DeleteFoodByID, GetFoodByID, GetFoods, GetVendorDetail, UpdateServiceAvailablity, UpdateVendorDetail, UploadCoverPicture, VendorLogin } from '../controllers';
import { foodImages, uploadVendorImage } from '../helpers/UploadHelper';
import { Authenticate } from '../middlewares/CommonAuth';
import { ValidateUploadCover } from '../validators';


const router = express.Router();



router.post("/login", VendorLogin)

router.use(Authenticate)
router.get("/profile", GetVendorDetail)
router.patch("/picture", uploadVendorImage, UploadCoverPicture)
router.patch("/profile", UpdateVendorDetail)
router.patch("/service", UpdateServiceAvailablity)


router.post("/food", foodImages, CreateFood)
router.get("/food", GetFoods)
router.get("/food/:id", GetFoodByID)
router.delete("/food/:id", DeleteFoodByID)



export { router as VendorRoutes }