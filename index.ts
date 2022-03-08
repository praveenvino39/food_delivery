import bodyParser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
import { ConnectToDatabase } from './config'
import { AdminRoutes, ShopingRoutes, VendorRoutes,  } from './routes'
import { Joi, ValidationError } from "express-validation"
import { HandleError } from './middlewares/ErrorHandler'
import { ExpressApp } from './services/ExpressApp'
import { connectToDatabase } from './services/Database'
import cors from 'cors'



const startServer = async ()=>{
    const app = express()
    app.use(cors())
    await connectToDatabase()
    await ExpressApp(app)
    app.listen(1000,'0.0.0.0', () => console.log("Server is up and runing"))
}

startServer()

