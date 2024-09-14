import { z } from "zod"

export const registerSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email().min(3).max(225),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
    userAgent: z.string().optional()
}).refine( (data)=> data.password === data.confirmPassword,{
    message:"password do not match"
})

export const loginSchema = z.object({
  email: z.string().email().min(3).max(225),
  password: z.string().min(8).max(50),
  userAgent: z.string().optional()
});


export const  verificationCodeSchema = z.string().min(1).max(26)

export const  emailSchema = z.string().min(8).max(255)

export const resetPasswordSchema = z.object({
  verificationCode: z.string().min(1).max(26),
  password: z.string().min(8).max(50),
});