import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"
import { PORT } from "./constants/env"
import errorHandler from "./middlewares/errorHandler"
import authRouter from "./routes/auth.route"
import connectDB from "./utils/db"


const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    // origin: process.env.APP_ORIGIN,
    // credentials: true,
  })
);

app.use("/auth", authRouter)




app.use(errorHandler)

app.listen(PORT,()=>{
    connectDB()
    console.log(`server is running on http://localhost:${PORT}`)
})