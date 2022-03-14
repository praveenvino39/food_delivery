import bodyParser from 'body-parser'
import express, { Application, NextFunction, Request, Response } from 'express'
import { ConnectToDatabase } from '../config'
import { AdminRoutes, ShopingRoutes, UserRoutes, VendorRoutes, } from '../routes'
import { Joi, ValidationError } from "express-validation"
import { HandleError } from '../middlewares/ErrorHandler'
import io from 'socket.io'

const app = express()


export const ExpressApp =async (app: Application) => {

    //Middlewares
    app.use("/images", express.static("src/images"))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))


    //Routes
    app.use("/admin", AdminRoutes)
    app.use("/vendor", VendorRoutes)
    app.use("/user", UserRoutes)
    app.use("/", ShopingRoutes)


    app.use(HandleError)
    //Error Middleware
    return app
}

