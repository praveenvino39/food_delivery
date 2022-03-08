import { NextFunction, Response, Request } from "express";
import { SendResponse } from ".";
import { AuthPayload } from "../dto";
import { ValidateToken } from "../utility";


declare global{
    namespace Express {
        interface Request {
          user: AuthPayload
        }
      }
}
  

export const Authenticate = async (req:Request, res:Response, next:NextFunction)=>{
    const validate = await ValidateToken(req)
    if(validate){
        next()
    }else{
        return res.status(401).json(SendResponse(false, "Request not Authorized", null))
    }
}