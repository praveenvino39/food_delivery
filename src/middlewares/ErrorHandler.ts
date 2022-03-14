import { NextFunction, Request, Response } from "express"
import { ValidationError } from "express-validation"

export const HandleError = (err:ValidationError, req:Request, res:Response, next:NextFunction)=> {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
    return res.status(500).json(err)
  }