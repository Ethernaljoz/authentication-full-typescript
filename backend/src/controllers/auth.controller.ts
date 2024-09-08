import { CREATED, OK } from "../constants/httpCode";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { createAccount, login } from "../services/auth.service";
import { setAuthCookie } from "../utils/cookies";
import catchErrors from "../utils/catchErrors";



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
            message: "login successfuly"
        })
    }
)