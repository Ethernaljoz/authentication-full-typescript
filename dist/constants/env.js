"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_APP_PASSWORD = exports.EMAIL_SENDER = exports.JWT_REFRESH_SECRET = exports.JWT_SECRET = exports.MONGO_URI = exports.APP_ORIGIN = exports.NODE_ENV = exports.PORT = void 0;
const getEnv = (key, defaultValue) => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw Error(`the ${key} value is missing`);
    }
    return value;
};
exports.PORT = getEnv("PORT", "3000");
exports.NODE_ENV = getEnv("NODE_ENV");
exports.APP_ORIGIN = getEnv("APP_ORIGIN");
exports.MONGO_URI = getEnv("MONGO_URI");
exports.JWT_SECRET = getEnv("JWT_SECRET");
exports.JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
exports.EMAIL_SENDER = getEnv("EMAIL_SENDER");
exports.EMAIL_APP_PASSWORD = getEnv("EMAIL_APP_PASSWORD");
