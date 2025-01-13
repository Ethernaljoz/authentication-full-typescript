import mongoose from "mongoose";

export const enum verificationCodeType {
    EmailVerification = "email_verification",
    PasswordReset = "password_reset"
}

declare global {
    namespace Express{
        interface Request{
            userId: mongoose.Types.ObjectId
            sessionId: mongoose.Types.ObjectId 
        }
    }
}
