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
exports.getAllUserHandler = void 0;
const httpCode_1 = require("../constants/httpCode");
const user_model_1 = __importDefault(require("../models/user.model"));
const AppError_1 = require("../utils/AppError");
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
exports.getAllUserHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield user_model_1.default.find();
    (0, AppError_1.appAssert)(users, httpCode_1.NOT_FOUND, "");
    const user = users.map(user => user.omitPassword());
    return res.status(httpCode_1.OK).json(user);
}));
