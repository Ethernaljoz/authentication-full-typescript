import { CREATED } from "../constants/httpCode";
import { registerSchema } from "../schemas/auth.schema";
import { createAccount } from "../services/auth.service";
import { setAuthCookie } from "../utils/Helpers";
import catchErrors from "../utils/catchErrors";



export const registerHandler = catchErrors(
    async(req,res)=>{
        const request = registerSchema.parse({...req.body, userAgent:req.headers["user-agent"]})
        
        const {user, accessToken, refreshToken }= await createAccount(request)

        return setAuthCookie({res, accessToken, refreshToken}).status(CREATED).json(user)
    }
)