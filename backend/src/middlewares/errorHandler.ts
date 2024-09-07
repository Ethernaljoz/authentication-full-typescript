import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpCode";

import { z } from "zod"
import AppError from "../utils/AppError";

const errorHandler:ErrorRequestHandler = async (error,req,res,next)=>{

    if(error instanceof AppError){
        return handleAppError(res, error)
    }

    if(error instanceof z.ZodError){
        return handleZodError(res, error)
    }



    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send("Internal server error")

}

export default errorHandler



const handleZodError = (res:Response, error:z.ZodError)=>{
    const errors = error.issues.map((error)=>({
        path: error.path.join("."),
        error:error.message
    }))
    
    return res.status(BAD_REQUEST).json({ errors ,message: error.message });
}



const handleAppError = (res:Response, error:AppError)=>{
    return res.status(error.statusCode).json({message: error.message})
}