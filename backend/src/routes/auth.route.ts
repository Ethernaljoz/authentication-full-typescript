import { Router } from "express";
import { loginHandler, logoutHandler, registerHandler } from "../controllers/auth.controller";


const authRouter = Router()

// prefix /auth
authRouter.post("/register", registerHandler)
authRouter.post("/login", loginHandler)
authRouter.get("/logout", logoutHandler)


export default authRouter