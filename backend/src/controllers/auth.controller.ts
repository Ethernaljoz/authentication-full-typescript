import { registerSchema } from "../schemas/auth.schema";
import catchErrors from "../utils/catchErrors";



export const registerHandler = catchErrors(
    async(req,res)=>{
        const request = registerSchema.parse({...req.body, userAgent:req.headers["user-agent"]})
    
    }
)