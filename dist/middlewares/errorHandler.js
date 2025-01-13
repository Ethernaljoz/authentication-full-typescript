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
const httpCode_1 = require("../constants/httpCode");
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../utils/AppError"));
const cookies_1 = require("../utils/cookies");
const errorHandler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.path === cookies_1.REFRESH_PATH) {
        (0, cookies_1.clearAuthCookie)(res);
    }
    if (error instanceof AppError_1.default) {
        return handleAppError(res, error);
    }
    if (error instanceof zod_1.z.ZodError) {
        return handleZodError(res, error);
    }
    console.log(error);
    return res.status(httpCode_1.INTERNAL_SERVER_ERROR).send("Internal server error");
});
exports.default = errorHandler;
const handleZodError = (res, error) => {
    const errors = error.issues.map((error) => ({
        path: error.path.join("."),
        error: error.message
    }));
    return res.status(httpCode_1.BAD_REQUEST).json({ errors, message: error.message });
};
const handleAppError = (res, error) => {
    return res.status(error.statusCode).json({ message: error.message });
};
