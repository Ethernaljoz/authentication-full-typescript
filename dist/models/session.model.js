"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Helpers_1 = require("../utils/Helpers");
const sessionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "User", index: true },
    userAgent: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now() },
    expiresAt: { type: Date, required: true, default: (0, Helpers_1.ThirtyDaysFromNow)() }
});
const SessionModel = mongoose_1.default.model("Session", sessionSchema);
exports.default = SessionModel;
