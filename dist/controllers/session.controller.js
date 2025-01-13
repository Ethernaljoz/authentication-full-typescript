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
exports.deleteSessionHandler = exports.getSessionHandler = void 0;
const zod_1 = require("zod");
const httpCode_1 = require("../constants/httpCode");
const session_model_1 = __importDefault(require("../models/session.model"));
const AppError_1 = require("../utils/AppError");
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
exports.getSessionHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessions = yield session_model_1.default.find({
        userId: req.userId, expiresAt: { $gt: new Date() }
    }, {
        _id: 1, userAgent: 1, createdAt: 1
    }, {
        sort: { createdAt: -1 }
    });
    return res.status(httpCode_1.OK).json(sessions.map((session) => (Object.assign(Object.assign({}, session.toObject()), (session.id === req.sessionId && { isCurrent: true })))));
}));
exports.deleteSessionHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = zod_1.z.string().parse(req.params.id);
    const deleted = yield session_model_1.default.findOneAndDelete({
        _id: sessionId,
        userId: req.userId
    });
    (0, AppError_1.appAssert)(deleted, httpCode_1.NOT_FOUND, "Session not found");
    return res.status(httpCode_1.OK).json({ message: "Session removed" });
}));
