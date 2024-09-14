import { CREATED, OK, UNAUTHORIZED } from "../constants/httpCode";
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verificationCodeSchema } from "../schemas/auth.schema";
import { createAccount, login, refreshUserAccessToken, resetPassword, sendPasswordResetEmail, verifyEmail } from "../services/auth.service";
import { clearAuthCookie, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookie } from "../utils/cookies";
import catchErrors from "../utils/catchErrors";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import { appAssert } from "../utils/AppError";



export const registerHandler = catchErrors(
    async(req,res)=>{
        const request = registerSchema.parse({...req.body, userAgent:req.headers["user-agent"]})
        
        const { user, accessToken, refreshToken } = await createAccount(request);

        return setAuthCookie({res, accessToken, refreshToken}).status(CREATED).json(user)
    }
)


export const loginHandler = catchErrors(
    async(req, res) => {
        const request = loginSchema.parse({
            ...req.body,
            userAgent:req.headers["user-agent"]
        })

        const {user, accessToken, refreshToken} = await login(request)

        return setAuthCookie({res, accessToken, refreshToken}).status(OK).json({
            message: "login successfully"
        })
    }
)

export const logoutHandler = catchErrors(
    async(req, res) =>{
        const token = req.cookies.accessToken as string | undefined;

        const { payload } = verifyToken(token || "")

        if(payload){
            await SessionModel.findByIdAndDelete(payload.sessionId)
        }

        return clearAuthCookie(res).status(OK).json({
            message: "logout successfully"
        })

    }
)

export const refreshHandler = catchErrors(
    async(req, res)=>{
        const refreshToken = req.cookies.refreshToken as string | undefined
        appAssert(refreshToken, UNAUTHORIZED, "Missing the refresh token")

        const { accessToken , newRefreshToken } = await refreshUserAccessToken(refreshToken || "")

        if(newRefreshToken){
            res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions())
        }

        return res.cookie("accessToken", accessToken, getAccessTokenCookieOptions()).status(OK).json({
            message : "Access token refreshed"
        })
    }
)

export const verifyEmailHandler = catchErrors(
    async(req, res)=>{
        const verificationCode = verificationCodeSchema.parse(req.params.code)

        await verifyEmail(verificationCode)

        return res.status(OK).json({
            message: "Email verified successfully"
        })
    }
)


export const sendPasswordResetHandler = catchErrors(
    async (req, res) => {
        const email = emailSchema.parse(req.body.email)
        
        await sendPasswordResetEmail(email)

        return res.status(OK).json({
          message: "Password reset email sent",
        });
    }
);


export const resetPasswordHandler = catchErrors(
    async(req, res)=>{
        const request = resetPasswordSchema.parse(req.body)

        await resetPassword(request)

        return clearAuthCookie(res).status(OK).json({
            message:"User password reset successfully"
        })
    }
)