"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.emailSchema = exports.verificationCodeSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    email: zod_1.z.string().email().min(3).max(225),
    password: zod_1.z.string().min(8).max(50),
    confirmPassword: zod_1.z.string().min(8).max(50),
    userAgent: zod_1.z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "password do not match"
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().min(3).max(225),
    password: zod_1.z.string().min(8).max(50),
    userAgent: zod_1.z.string().optional()
});
exports.verificationCodeSchema = zod_1.z.string().min(1).max(26);
exports.emailSchema = zod_1.z.string().min(8).max(255);
exports.resetPasswordSchema = zod_1.z.object({
    verificationCode: zod_1.z.string().min(1).max(26),
    password: zod_1.z.string().min(8).max(50),
});
