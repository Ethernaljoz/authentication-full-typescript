import jwt,{ SignOptions } from "jsonwebtoken"
import { SessionDocument } from "../models/session.model"
import { UserDocument } from "../models/user.model"
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env"


 //----------------------@types----------------------
export type accessTokenPayload = {
    sessionId: SessionDocument["_id"]
    userId: UserDocument["_id"]
}

export type refreshTokenPayload = {
    sessionId: SessionDocument["_id"];
};

type signOptionsAndSecret = SignOptions & { secret: string}
type verifyOptionsAndSecret = SignOptions & { secret?: string}

 // -------------------@options-----------------------------

const defaultOptions:SignOptions = {
    audience: ["user"]
}
const accessTokenOptions: signOptionsAndSecret = {
  secret: JWT_SECRET,
  expiresIn: "15m",
};
export const refreshTokenOptions: signOptionsAndSecret = {
    secret:JWT_REFRESH_SECRET,
    expiresIn:"30d",
}


 //-----------------------@function------------------------------
export const signToken = 
(payload : accessTokenPayload | refreshTokenPayload,
options?: signOptionsAndSecret
) => {
    const { secret , ...signOpts } = options || accessTokenOptions

    return jwt.sign(payload, secret, {...defaultOptions,...signOpts})
}


export const verifyToken = <TPayload extends object = accessTokenPayload> (
    token:string, 
    options?:verifyOptionsAndSecret
) => {
    const { secret = JWT_SECRET, ...verifyOpts} = options || {}
    try {
        const payload = jwt.verify(token, secret, {
            ...defaultOptions,
            ...verifyOpts
        }) as TPayload

        return { payload }

    } catch (error:any) {
        return {
            error : error.message
        }
    }

    
}

