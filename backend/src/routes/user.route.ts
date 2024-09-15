import { Router } from "express";
import { getAllUserHandler } from "../controllers/user.controller";


const userRouter = Router()

// prefix user
userRouter.get("/", getAllUserHandler);

export default userRouter