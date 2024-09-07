import { CookieOptions, Response } from "express"


// ------------ @ Date function---------------------


export const oneYearFromNow = () => new Date( Date.now() + 365 * 24 * 60 * 60 * 1000)
export const ThirtyDaysFromNow = () => new Date( Date.now() + 30 * 24 * 60 * 60 * 1000)
export const fifteenMinutesFromNow = () => new Date( Date.now() + 15 * 60 * 1000)



// ------------ @ cookie function---------------------

interface setAuthCookieParams {
    res:Response,
    accessToken:string,
    refreshToken:string
}

const secure = process.env.NODE_ENV !== "developement"

const defaultCookieOptions: CookieOptions = {
    sameSite:"strict",
    httpOnly:true,
    secure
}

const getAccessTokenCookieOptions = ()=>({
    ...defaultCookieOptions,
    expires:fifteenMinutesFromNow()
})

const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaultCookieOptions,
    expires:ThirtyDaysFromNow(),
    path:"/auth/refresh"
})

export const setAuthCookie = ({res,accessToken,refreshToken}:setAuthCookieParams)=>{
    return res.cookie("accessToken",accessToken,getAccessTokenCookieOptions()).cookie("refreshToken",refreshToken, getRefreshTokenCookieOptions())
}

















