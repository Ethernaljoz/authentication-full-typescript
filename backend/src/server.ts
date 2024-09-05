import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "dotenv/config"


const app = express()
const port = 5000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    // origin: process.env.APP_ORIGIN,
    // credentials: true,
  })
);

app.get("/",(req:Request,res:Response)=>{
    res.status(200).send("hello world")
})


app.listen(port,()=>{
    console.log("server is running on http://localhost:5000")
})