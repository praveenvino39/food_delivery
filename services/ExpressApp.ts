import bodyParser from 'body-parser'
import express, { Application, NextFunction, Request, Response } from 'express'
import { ConnectToDatabase } from '../config'
import { AdminRoutes, ShopingRoutes, UserRoutes, VendorRoutes, } from '../routes'
import { Joi, ValidationError } from "express-validation"
import { HandleError } from '../middlewares/ErrorHandler'

const app = express()


export const ExpressApp =async (app: Application) => {
    //Middlewares
    app.use("/images", express.static("images"))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))


    //Routes
    app.use("/admin", AdminRoutes)
    app.use("/vendor", VendorRoutes)
    app.use("/user", UserRoutes)
    app.use("/", ShopingRoutes)



    //Error Middleware
    app.use(HandleError)
    return app
}

