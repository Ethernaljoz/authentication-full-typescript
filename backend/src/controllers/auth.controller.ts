import { CREATED, OK } from "../constants/httpCode";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { createAccount, login } from "../services/auth.service";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies";
import catchErrors from "../utils/catchErrors";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";



export const registerHandler = catchErrors(
    async(req,res)=>{
        const request = registerSchema.parse({...req.body, userAgent:req.headers["user-agent"]})
        
        const {user, accessToken, refreshToken }= await createAccount(request)

        return setAuthCookie({res, accessToken, refreshToken}).status(CREATED).json(user)
    }
)


export const loginHandler = catchErrors(
    async(req, res) => {
        const resquest = loginSchema.parse({
            ...req.body,
            userAgent:req.headers["user-agent"]
        })

        const {user, accessToken, refreshToken} = await login(resquest)

        return setAuthCookie({res, accessToken, refreshToken}).status(OK).json({
            message: "login successfully"
        })
    }
)

export const logoutHandler = catchErrors(
    async(req, res) =>{
        const token = req.cookies.accessToken

        const { payload } = verifyToken(token || "")

        if(payload){
            await SessionModel.findByIdAndDelete(payload.sessionId)
        }

        return clearAuthCookie(res).status(OK).json({
            message: "logout successfully"
        })

    }
)