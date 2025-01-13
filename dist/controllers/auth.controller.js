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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordHandler = exports.sendPasswordResetHandler = exports.verifyEmailHandler = exports.refreshHandler = exports.logoutHandler = exports.loginHandler = exports.registerHandler = void 0;
const httpCode_1 = require("../constants/httpCode");
const auth_schema_1 = require("../schemas/auth.schema");
const auth_service_1 = require("../services/auth.service");
const cookies_1 = require("../utils/cookies");
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const jwt_1 = require("../utils/jwt");
const session_model_1 = __importDefault(require("../models/session.model"));
const AppError_1 = require("../utils/AppError");
exports.registerHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = auth_schema_1.registerSchema.parse(Object.assign(Object.assign({}, req.body), { userAgent: req.headers["user-agent"] }));
    const { user, accessToken, refreshToken } = yield (0, auth_service_1.createAccount)(request);
    return (0, cookies_1.setAuthCookie)({ res, accessToken, refreshToken }).status(httpCode_1.CREATED).json(user);
}));
exports.loginHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = auth_schema_1.loginSchema.parse(Object.assign(Object.assign({}, req.body), { userAgent: req.headers["user-agent"] }));
    const { user, accessToken, refreshToken } = yield (0, auth_service_1.login)(request);
    return (0, cookies_1.setAuthCookie)({ res, accessToken, refreshToken }).status(httpCode_1.OK).json({
        message: "login successfully"
    });
}));
exports.logoutHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.accessToken;
    const { payload } = (0, jwt_1.verifyToken)(token || "");
    if (payload) {
        yield session_model_1.default.findByIdAndDelete(payload.sessionId);
    }
    return (0, cookies_1.clearAuthCookie)(res).status(httpCode_1.OK).json({
        message: "logout successfully"
    });
}));
exports.refreshHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    (0, AppError_1.appAssert)(refreshToken, httpCode_1.UNAUTHORIZED, "Missing the refresh token");
    const { accessToken, newRefreshToken } = yield (0, auth_service_1.refreshUserAccessToken)(refreshToken || "");
    if (newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, (0, cookies_1.getRefreshTokenCookieOptions)());
    }
    return res.cookie("accessToken", accessToken, (0, cookies_1.getAccessTokenCookieOptions)()).status(httpCode_1.OK).json({
        message: "Access token refreshed"
    });
}));
exports.verifyEmailHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationCode = auth_schema_1.verificationCodeSchema.parse(req.params.code);
    yield (0, auth_service_1.verifyEmail)(verificationCode);
    return res.status(httpCode_1.OK).json({
        message: "Email verified successfully"
    });
}));
exports.sendPasswordResetHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = auth_schema_1.emailSchema.parse(req.body.email);
    yield (0, auth_service_1.sendPasswordResetEmail)(email);
    return res.status(httpCode_1.OK).json({
        message: "Password reset email sent",
    });
}));
exports.resetPasswordHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = auth_schema_1.resetPasswordSchema.parse(req.body);
    yield (0, auth_service_1.resetPassword)(request);
    return (0, cookies_1.clearAuthCookie)(res).status(httpCode_1.OK).json({
        message: "User password reset successfully"
    });
}));
