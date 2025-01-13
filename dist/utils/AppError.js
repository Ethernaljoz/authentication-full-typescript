"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appAssert = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}
exports.default = AppError;
/**
 * Asserts a condition and throws an AppError if the condition is falsy.
 */
const appAssert = (condition, httpStatusCode, message) => (0, node_assert_1.default)(condition, new AppError(httpStatusCode, message));
exports.appAssert = appAssert;
