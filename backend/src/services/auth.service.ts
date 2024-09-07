import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env"
import { CONFLICT } from "../constants/httpCode"
import SessionModel from "../models/session.model"
import UserModel from "../models/user.model"
import VerificationCodeModel from "../models/verificationCode.model"
import { appAssert } from "../utils/AppError"
import { oneYearFromNow } from "../utils/Helpers"
import { verificationCodeType } from "../utils/Types"
import jwt from "jsonwebtoken"



interface createAccountType {
    username:string,
    email:string,
    password:string,
    userAgent?:string
}


export const createAccount = async (data:createAccountType)=>{

    const existingUser = UserModel.exists({email:data.email})

    appAssert(!existingUser, CONFLICT, "Email already in use");

    const user = await UserModel.create({
        username:data.username,
        email:data.email,
        password:data.password
    })

    // verification code
    const verificationCode = await VerificationCodeModel.create({
        userId:user._id,
        type:verificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow()
    })

    //send email

    //@ session
    const session = await SessionModel.create({
        userId:user._id,
        userAgent:data.userAgent
    })

    //@ access and refresh token
    const accessToken = jwt.sign({
        userId:user._id,
        sessionId:session._id 
    },JWT_SECRET,
    {
        audience:["user"],
        expiresIn :"15m"
    })
    
    const refreshToken = jwt.sign({
        sessionId:session._id 
    },JWT_REFRESH_SECRET,
    {
        audience:["user"],
        expiresIn :"30d"
    })



    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    }

}