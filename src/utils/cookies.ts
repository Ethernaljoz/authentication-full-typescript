import { CookieOptions, Response } from "express";
import { ThirtyDaysFromNow, fifteenMinutesFromNow } from "./Helpers";

interface setAuthCookieParams {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

const secure = process.env.NODE_ENV !== "developement";
export const REFRESH_PATH = "/auth/refresh"
const defaultCookieOptions: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = () => ({
  ...defaultCookieOptions,
  expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaultCookieOptions,
  expires: ThirtyDaysFromNow(),
  path: REFRESH_PATH,
});

export const setAuthCookie = ({
  res,
  accessToken,
  refreshToken,
}: setAuthCookieParams) => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookie = (res:Response)=>{
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken", { ...defaultCookieOptions, path:REFRESH_PATH });
}