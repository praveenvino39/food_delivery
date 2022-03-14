import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { Request } from "express"
import { AuthPayload } from "../dto";
import { APP_SECRET } from "../config/AppConfig";


const crypt = bcrypt as any


export const GenerateSalt = async () => {
    return await crypt.genSalt()
}


export const GeneratePassword = async (password: string, salt: string) => {
    return await crypt.hash(password, salt)
}


export const GenerateOtp = () => {
    return Math.floor(Math.random()*10000)
}


export const ValidatePassword = async (plainPassword: string, encryptedPassword: string, salt: string) => {
    return await GeneratePassword(plainPassword, salt) === encryptedPassword;
}


export const GenerateToken = async (payload: AuthPayload) => {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '30d' })
}




export const ValidateToken = async (req:Request)=>{
    const token = req.get('Authorization')
    if(token){
        const payload = jwt.verify(token.split(" ")[1],APP_SECRET) as AuthPayload
        req.user = payload
        return true
    }

    return false
}