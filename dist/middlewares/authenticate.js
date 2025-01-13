"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const AppError_1 = require("../utils/AppError");
const httpCode_1 = require("../constants/httpCode");
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    (0, AppError_1.appAssert)(accessToken, httpCode_1.UNAUTHORIZED, "not authorised - invalid access token");
    const { error, payload } = (0, jwt_1.verifyToken)(accessToken);
    (0, AppError_1.appAssert)(payload, httpCode_1.UNAUTHORIZED, error === "jwt expired" ? "token expired" : "Invalid token");
    req.userId = payload.userId,
        req.sessionId = payload.sessionId;
    next();
});
exports.authenticate = authenticate;
