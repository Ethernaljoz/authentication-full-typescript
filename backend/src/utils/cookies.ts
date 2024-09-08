import { CookieOptions, Response } from "express";
import { ThirtyDaysFromNow, fifteenMinutesFromNow } from "./Helpers";

interface setAuthCookieParams {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

const secure = process.env.NODE_ENV !== "developement";
const REFRESH_PATH = "/auth/refresh"
const defaultCookieOptions: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

const getAccessTokenCookieOptions = () => ({
  ...defaultCookieOptions,
  expires: fifteenMinutesFromNow(),
});

const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaultCookieOptions,
  expires: ThirtyDaysFromNow(),
  path: "/auth/refresh",
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