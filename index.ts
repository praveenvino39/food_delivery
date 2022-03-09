import bodyParser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
import { HandleError } from './middlewares/ErrorHandler'
import { ExpressApp } from './services/ExpressApp'
import { connectToDatabase } from './services/Database'
import cors from 'cors'
require('dotenv').config();

const startServer = async ()=>{
    const app = express()
    app.use(cors())
    await connectToDatabase()
    await ExpressApp(app)
    const PORT = process.env.PORT || 1000
    app.listen(PORT , () => console.log("Server is up and runing"))
}

startServer()


