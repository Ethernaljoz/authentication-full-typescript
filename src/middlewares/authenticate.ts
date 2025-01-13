import { RequestHandler } from "express";
import { appAssert } from "../utils/AppError";
import { UNAUTHORIZED } from "../constants/httpCode";
import { verifyToken } from "../utils/jwt";
import mongoose from "mongoose";


export const authenticate:RequestHandler = async(req, res, next) =>{
    const accessToken = req.cookies.accessToken as string | undefined

    appAssert(accessToken,UNAUTHORIZED,"not authorised - invalid access token")

    const { error, payload } = verifyToken(accessToken)
    appAssert(payload,UNAUTHORIZED,error === "jwt expired"?"token expired":"Invalid token")

    req.userId = payload.userId as mongoose.Types.ObjectId,
    req.sessionId = payload.sessionId as mongoose.Types.ObjectId

    next()

}