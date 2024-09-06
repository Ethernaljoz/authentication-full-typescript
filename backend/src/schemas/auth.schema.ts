import { z } from "zod"

export const registerSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email().min(3).max(50),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
    userAgent: z.string().optional()
}).refine( (data)=> data.password === data.confirmPassword,{
    message:"password do not match"
})