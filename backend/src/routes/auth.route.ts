import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler } from "../controllers/auth.controller";


const authRouter = Router()

// prefix /auth
authRouter.post("/register", registerHandler)
authRouter.post("/login", loginHandler)
authRouter.get("/logout", logoutHandler)
authRouter.get("/refresh", refreshHandler)


export default authRouter