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
exports.resetPassword = exports.sendPasswordResetEmail = exports.verifyEmail = exports.refreshUserAccessToken = exports.login = exports.createAccount = void 0;
const emailTemplate_1 = require("../constants/emailTemplate");
const env_1 = require("../constants/env");
const httpCode_1 = require("../constants/httpCode");
const session_model_1 = __importDefault(require("../models/session.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const verificationCode_model_1 = __importDefault(require("../models/verificationCode.model"));
const AppError_1 = require("../utils/AppError");
const Helpers_1 = require("../utils/Helpers");
const jwt_1 = require("../utils/jwt");
const sendMail_1 = require("../utils/sendMail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createAccount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.default.exists({
        email: data.email,
    });
    (0, AppError_1.appAssert)(!existingUser, httpCode_1.CONFLICT, "Email already in use");
    const user = yield user_model_1.default.create({
        username: data.username,
        email: data.email,
        password: data.password,
        userAgent: data.userAgent
    });
    const userId = user._id;
    const verificationCode = yield verificationCode_model_1.default.create({
        userId,
        type: "email_verification" /* verificationCodeType.EmailVerification */,
        expiresAt: (0, Helpers_1.oneYearFromNow)(),
    });
    const url = `${env_1.APP_ORIGIN}/email/verify/${verificationCode._id}`;
    const sentMessageInfo = yield (0, sendMail_1.sendMail)(Object.assign({ to: user.email }, (0, emailTemplate_1.getVerifyEmailTemplate)(url)));
    if (sentMessageInfo.rejected)
        console.error(sentMessageInfo.response);
    const session = yield session_model_1.default.create({
        userId,
        userAgent: data.userAgent,
    });
    const refreshToken = (0, jwt_1.signToken)({
        sessionId: session._id,
    }, jwt_1.refreshTokenOptions);
    const accessToken = (0, jwt_1.signToken)({
        userId,
        sessionId: session._id,
    });
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
});
exports.createAccount = createAccount;
const login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: data.email });
    (0, AppError_1.appAssert)(user, httpCode_1.UNAUTHORIZED, "Invalid email or password");
    const passwordMatch = user.comparePassword(data.password);
    (0, AppError_1.appAssert)(passwordMatch, httpCode_1.UNAUTHORIZED, "Invalid email or password");
    const session = yield session_model_1.default.create({
        userId: user._id,
        userAgent: data.userAgent,
    });
    const accessToken = (0, jwt_1.signToken)({ userId: user._id, sessionId: session._id });
    const refreshToken = (0, jwt_1.signToken)({ sessionId: session._id }, jwt_1.refreshTokenOptions);
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    };
});
exports.login = login;
const refreshUserAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { payload } = (0, jwt_1.verifyToken)(refreshToken, { secret: jwt_1.refreshTokenOptions.secret });
    (0, AppError_1.appAssert)(payload, httpCode_1.UNAUTHORIZED, "Invalid refresh token");
    const session = yield session_model_1.default.findById(payload.sessionId);
    const now = Date.now();
    (0, AppError_1.appAssert)(session && session.expiresAt.getTime() > now, httpCode_1.UNAUTHORIZED, "Session expired");
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= Helpers_1.OneDays;
    if (sessionNeedsRefresh) {
        session.expiresAt = (0, Helpers_1.ThirtyDaysFromNow)();
        yield session.save();
    }
    const accessToken = (0, jwt_1.signToken)({ userId: session.userId,
        sessionId: session._id
    });
    const newRefreshToken = sessionNeedsRefresh ? (0, jwt_1.signToken)({ sessionId: session._id }, jwt_1.refreshTokenOptions) : undefined;
    return {
        accessToken,
        newRefreshToken
    };
});
exports.refreshUserAccessToken = refreshUserAccessToken;
const verifyEmail = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const validCode = yield verificationCode_model_1.default.findOne({
        _id: code,
        type: "email_verification" /* verificationCodeType.EmailVerification */,
        expiresAt: { $gt: new Date() }
    });
    (0, AppError_1.appAssert)(validCode, httpCode_1.NOT_FOUND, "Invalid or expired verification code");
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(validCode.userId, { verified: true }, { new: true });
    (0, AppError_1.appAssert)(updatedUser, httpCode_1.INTERNAL_SERVER_ERROR, "failed to verify email");
    yield validCode.deleteOne();
    return {
        user: updatedUser.omitPassword()
    };
});
exports.verifyEmail = verifyEmail;
const sendPasswordResetEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email, });
    (0, AppError_1.appAssert)(user, httpCode_1.NOT_FOUND, "User not found");
    const count = yield verificationCode_model_1.default.countDocuments({
        userId: user._id,
        type: "password_reset" /* verificationCodeType.PasswordReset */,
        createdAt: { $gt: (0, Helpers_1.fiveMinutesAgo)() }
    });
    (0, AppError_1.appAssert)(count <= 1, httpCode_1.TOO_MANY_REQUESTS, "Too many requests, please try again later");
    const expiresAt = (0, Helpers_1.oneHourFromNow)();
    const verificationCode = yield verificationCode_model_1.default.create({
        userId: user._id,
        type: "password_reset" /* verificationCodeType.PasswordReset */,
        expiresAt
    });
    const url = `${env_1.APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`;
    const sentMessageInfo = yield (0, sendMail_1.sendMail)(Object.assign({ to: email }, (0, emailTemplate_1.getPasswordResetTemplate)(url)));
    (0, AppError_1.appAssert)(sentMessageInfo.rejected, httpCode_1.INTERNAL_SERVER_ERROR, `${sentMessageInfo.response}`);
    return {
        url,
        emailId: sentMessageInfo.messageId
    };
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const resetPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ verificationCode, password }) {
    const validCode = yield verificationCode_model_1.default.findOne({
        _id: verificationCode,
        type: "password_reset" /* verificationCodeType.PasswordReset */,
        expiresAt: { $gt: new Date() }
    });
    (0, AppError_1.appAssert)(validCode, httpCode_1.NOT_FOUND, "Invalid or expired verification code");
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(validCode.userId, { password: yield bcrypt_1.default.hash(password, 12), });
    (0, AppError_1.appAssert)(updatedUser, httpCode_1.INTERNAL_SERVER_ERROR, "failed to reset the user password");
    yield validCode.deleteOne();
    yield session_model_1.default.deleteMany({ userId: validCode.userId });
    return {
        user: updatedUser.omitPassword()
    };
});
exports.resetPassword = resetPassword;
