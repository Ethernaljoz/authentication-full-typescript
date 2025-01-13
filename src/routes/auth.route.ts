import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler, resetPasswordHandler, sendPasswordResetHandler, verifyEmailHandler } from "../controllers/auth.controller";


const authRouter = Router()

// prefix /api/auth
authRouter.post("/register", registerHandler)
authRouter.post("/login", loginHandler)
authRouter.get("/logout", logoutHandler)
authRouter.get("/refresh", refreshHandler)
authRouter.get("/email/verify/:code", verifyEmailHandler)
authRouter.post("/password/forgot", sendPasswordResetHandler)
authRouter.post("/password/reset", resetPasswordHandler);


export default authRouter