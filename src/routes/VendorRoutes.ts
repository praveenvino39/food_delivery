import express, { NextFunction, Request, Response } from 'express'
import { validate } from 'express-validation';
import multer from 'multer';
import { AcceptOrder, CancelOrder, CreateFood, DeleteFoodByID, GetCancelledOrders, GetCurrentOrders, GetFoodByID, GetFoods, GetIncommingOrder, GetVendorDetail, ReadyToDispatchOrder, UpdateServiceAvailablity, UpdateVendorDetail, UploadCoverPicture, UploadProfilePicture, VendorLogin } from '../controllers';
import { foodImages, uploadVendorCoverImage, uploadVendorPictureImage } from '../helpers/UploadHelper';
import { Authenticate } from '../middlewares/CommonAuth';
import { ValidateCancelOrder, ValidateUploadCover } from '../validators';


const router = express.Router();



router.post("/login", VendorLogin)

router.use(Authenticate)
router.get("/profile", GetVendorDetail)
router.patch("/picture", uploadVendorPictureImage, UploadProfilePicture)
router.patch("/cover", uploadVendorCoverImage, UploadCoverPicture)
router.patch("/profile", UpdateVendorDetail)
router.patch("/service", UpdateServiceAvailablity)


router.post("/food", foodImages, CreateFood)
router.get("/food", GetFoods)
router.get("/food/:id", GetFoodByID)
router.delete("/food/:id", DeleteFoodByID)


router.get("/order/incomming", GetIncommingOrder )
router.get("/order/cancelled", GetCancelledOrders )
router.get("/order/current", GetCurrentOrders )


router.get("/order/accept/:orderID", AcceptOrder )
router.get("/order/ready/:orderID", ReadyToDispatchOrder )
router.post("/order/cancel", validate(ValidateCancelOrder, {keyByField: true}, {}), CancelOrder  )





export { router as VendorRoutes }