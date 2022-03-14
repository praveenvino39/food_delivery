import { Router } from "express"
import { FoodReadyIn30Minute, GetAllFoods, GetAllVendor, SearchFood, SearchVendor } from "../controllers"



const router = Router()



router.get("/restaurants", GetAllVendor)
router.get("/restaurants/search", SearchVendor)
router.get("/foods", GetAllFoods)
router.get("/foods/search", SearchFood)
router.get("/foods/quick", FoodReadyIn30Minute)


export {router as ShopingRoutes}