import { CONFLICT, UNAUTHORIZED } from "../constants/httpCode"
import SessionModel from "../models/session.model"
import UserModel from "../models/user.model"
import VerificationCodeModel from "../models/verificationCode.model"
import { appAssert } from "../utils/AppError"
import { oneYearFromNow } from "../utils/Helpers"
import { verificationCodeType } from "../utils/Types"
import { refreshTokenOptions, signToken } from "../utils/jwt"



interface createAccountParams {
    username:string,
    email:string,
    password:string,
    userAgent?:string
}


export const createAccount = async (data:createAccountParams)=>{

    const existingUser = await UserModel.exists({email:data.email})

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
    const accessToken = signToken({userId:user._id, sessionId:session._id })
    
    const refreshToken = signToken({sessionId:session._id }, refreshTokenOptions)



    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    }

}


interface loginParams {
    email:string,
    password:string,
    userAgent?:string
}

export const login = async (data:loginParams)=>{
  const user = await UserModel.findOne({ email: data.email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  const passwordMatch = user.comparePassword(data.password);
  appAssert(passwordMatch, UNAUTHORIZED, "Invalid email or password");

  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  //@ access and refresh token
  const accessToken = signToken({ userId: user._id, sessionId: session._id });

  const refreshToken = signToken({ sessionId: session._id }, refreshTokenOptions);

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken
  };
}