import { Router } from "express"
import { validate } from "express-validation"
import { GetAllVendor } from "../controllers"
import { AddAddress, AddToCart, TopRestaurant, CreateUser, LoginUser, VerifyOtp, ViewCart, Checkout } from "../controllers/UserController"
import { Authenticate } from "../middlewares/CommonAuth"
import { ValidateAddAdress, ValidateAddtoCart, ValidateCheckout, ValidateCreateUser, ValidateLogin, ValidateVerifyOtp } from "../validators/User.validator"



const router = Router()



router.get("/top", TopRestaurant)
router.post("/signup", validate(ValidateCreateUser, { keyByField: true }, {}), CreateUser)
router.patch("/verify", validate(ValidateVerifyOtp, { keyByField: true }, {}), VerifyOtp)
router.post("/signin", validate(ValidateLogin, { keyByField: true }, {}), LoginUser)



router.use(Authenticate)
router.post("/address", validate(ValidateAddAdress, { keyByField: true }, {}), AddAddress)
router.post("/cart", validate(ValidateAddtoCart, { keyByField: true }, {}), AddToCart)
router.get("/cart", ViewCart)
router.post("/checkout", validate(ValidateCheckout, { keyByField: true },{}), Checkout)






//---------Authenticate-------------//



//Adress
router.post("/address")
router.patch("/address")
router.delete("/address/:id")


export { router as UserRoutes }
