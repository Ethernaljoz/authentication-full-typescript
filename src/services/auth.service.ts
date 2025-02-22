import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../constants/emailTemplate"
import { APP_ORIGIN } from "../constants/env"
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/httpCode"
import SessionModel from "../models/session.model"
import UserModel from "../models/user.model"
import VerificationCodeModel from "../models/verificationCode.model"
import { appAssert } from "../utils/AppError"
import { OneDays, ThirtyDaysFromNow, fiveMinutesAgo, oneHourFromNow, oneYearFromNow } from "../utils/Helpers"
import { verificationCodeType } from "../utils/Types"
import { refreshTokenOptions, refreshTokenPayload, signToken, verifyToken } from "../utils/jwt"
import { sendMail } from "../utils/sendMail"
import bcrypt from "bcrypt"


interface CreateAccountParams {
    username:string,
    email:string,
    password:string,
    userAgent?:string
}


export const createAccount = async (data: CreateAccountParams) => {

    const existingUser = await UserModel.exists({
      email: data.email,
    });
    appAssert(!existingUser, CONFLICT, "Email already in use");
  
    const user = await UserModel.create({
      username: data.username,
      email: data.email,
      password: data.password,
      userAgent: data.userAgent
    });
    const userId = user._id;
    const verificationCode = await VerificationCodeModel.create({
      userId,
      type: verificationCodeType.EmailVerification,
      expiresAt: oneYearFromNow(),
    });
  
    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
  
    const  sentMessageInfo  = await sendMail({
      to: user.email,
      ...getVerifyEmailTemplate(url),
    });
    if (sentMessageInfo.rejected) console.error(sentMessageInfo.response);
  
    const session = await SessionModel.create({
      userId,
      userAgent: data.userAgent,
    });
  
    const refreshToken = signToken(
      {
        sessionId: session._id,
      },
      refreshTokenOptions
    );
    const accessToken = signToken({
      userId,
      sessionId: session._id,
    });
    return {
      user: user.omitPassword(),
      accessToken,
      refreshToken,
    };
  };


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


  const accessToken = signToken({ userId: user._id, sessionId: session._id });

  const refreshToken = signToken({ sessionId: session._id }, refreshTokenOptions);

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken
  };
}


export const refreshUserAccessToken = async(refreshToken : string)=>{
    const { payload } =  verifyToken<refreshTokenPayload>(refreshToken,{secret:refreshTokenOptions.secret})
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token")

    const session = await SessionModel.findById(payload.sessionId)
    const now = Date.now()
    appAssert(session && session.expiresAt.getTime() > now, UNAUTHORIZED, "Session expired")

    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= OneDays;

    if(sessionNeedsRefresh){
        session.expiresAt = ThirtyDaysFromNow()
        await session.save()
    }

    const accessToken = signToken({userId:session.userId,
        sessionId:session._id
    })

    const newRefreshToken = sessionNeedsRefresh ? signToken({sessionId:session._id},refreshTokenOptions) : undefined

    return {
        accessToken,
        newRefreshToken
    }
}


export const verifyEmail = async(code: string)=>{
    const validCode = await VerificationCodeModel.findOne({
        _id:code,
        type: verificationCodeType.EmailVerification,
        expiresAt: {$gt: new Date()}
    })

    appAssert(validCode,NOT_FOUND, "Invalid or expired verification code")

    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId,
        {verified: true},
        {new:true}
    )
    
    appAssert(updatedUser,INTERNAL_SERVER_ERROR,"failed to verify email")

    await validCode.deleteOne()

    return {
        user:updatedUser.omitPassword()
    }
}


export const sendPasswordResetEmail = async(email: string)=>{
    const user = await UserModel.findOne({email,})
    appAssert(user,NOT_FOUND,"User not found")

    const count = await VerificationCodeModel.countDocuments({
        userId:user._id,
        type: verificationCodeType.PasswordReset,
        createdAt:{$gt:fiveMinutesAgo()}
    })

    appAssert(count <=1, TOO_MANY_REQUESTS,"Too many requests, please try again later")

    const expiresAt = oneHourFromNow()
    const verificationCode = await VerificationCodeModel.create({
        userId:user._id,
        type:verificationCodeType.PasswordReset,
        expiresAt
    })

    const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`

    const sentMessageInfo= await sendMail({
      to: email,
      ...getPasswordResetTemplate(url),
    });

    appAssert(sentMessageInfo.rejected, INTERNAL_SERVER_ERROR,`${sentMessageInfo.response}`)

    return {
        url,
        emailId : sentMessageInfo.messageId
    }
}

type ResetParams = {
    verificationCode:string,
    password:string
}
export const resetPassword = async ({verificationCode, password}:ResetParams)=>{

    const validCode = await VerificationCodeModel.findOne({
        _id:verificationCode,
        type:verificationCodeType.PasswordReset,
        expiresAt:{$gt: new Date()}
    })

    appAssert(validCode,NOT_FOUND,"Invalid or expired verification code")

    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId, 
        {password: await bcrypt.hash(password, 12),},
    );

    appAssert(updatedUser,INTERNAL_SERVER_ERROR,"failed to reset the user password")

    await validCode.deleteOne()

    await SessionModel.deleteMany({userId:validCode.userId})

    return {
        user: updatedUser.omitPassword()
    }

}