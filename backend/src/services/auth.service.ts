import { CONFLICT } from "../constants/httpCode"
import UserModel from "../models/user.model"
import VerificationCodeModel from "../models/verificationCode.model"
import AppError from "../utils/AppError"
import { verificationCodeType } from "../utils/Types"


interface createAccountType {
    username:string,
    email:string,
    password:string,
    userAgent:string
}


export const createAccount = async (data:createAccountType)=>{

    const existingUser = UserModel.exists({email:data.email})
    if(!existingUser){
        throw new AppError(CONFLICT, "Email already in use")
    }

    const user = await UserModel.create({
        username:data.username,
        email:data.email,
        password:data.password
    })

    // verification code
    const verificationCode = await VerificationCodeModel.create({
        userId:user._id,
        type:verificationCodeType.EmailVerification,
        // expiresAt:
    })

    //send email

    //session

    // access and refresh token

}