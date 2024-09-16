import { RequestHandler } from "express";
import { appAssert } from "../utils/AppError";
import { UNAUTHORIZED } from "../constants/httpCode";
import { verifyToken } from "../utils/jwt";

const authenticate:RequestHandler = async(req, res, next) =>{
    const accessToken = req.cookies.accessToken as string | undefined

    appAssert(accessToken,UNAUTHORIZED,"not authorised - invalid access token")

    const { error, payload } = verifyToken(accessToken)
    appAssert(payload,UNAUTHORIZED,error === "jwt expired"?"token expired":"Invalid token")

    req.userId = payload.userId
    req.sessionId = payload.sessionId

    next()

}