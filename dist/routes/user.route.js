"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const userRouter = (0, express_1.Router)();
// prefix /api/user
userRouter.get("/", user_controller_1.getAllUserHandler);
exports.default = userRouter;
