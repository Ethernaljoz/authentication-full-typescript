import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import {  PORT } from "./constants/env"
import errorHandler from "./middlewares/errorHandler"
import authRouter from "./routes/auth.route"
import connectDB from "./utils/db"
import userRouter from "./routes/user.route"
import sessionRoutes from "./routes/session.route"
import { authenticate } from "./middlewares/authenticate"


const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send('<h1>Welcome to Auth ts</h1>');
});

app.use("/api/auth", authRouter)

app.use("/api/user", authenticate, userRouter)
app.use("/api/session", authenticate, sessionRoutes)


app.use((req: Request, res: Response) => {
    res.status(404).json({message: "Route not found"})
})


app.use(errorHandler)


app.listen(PORT,()=>{
    connectDB()
    console.log(`server is running on http://localhost:${PORT}`)
})