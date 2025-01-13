"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = (0, express_1.Router)();
// prefix /api/auth
authRouter.post("/register", auth_controller_1.registerHandler);
authRouter.post("/login", auth_controller_1.loginHandler);
authRouter.get("/logout", auth_controller_1.logoutHandler);
authRouter.get("/refresh", auth_controller_1.refreshHandler);
authRouter.get("/email/verify/:code", auth_controller_1.verifyEmailHandler);
authRouter.post("/password/forgot", auth_controller_1.sendPasswordResetHandler);
authRouter.post("/password/reset", auth_controller_1.resetPasswordHandler);
exports.default = authRouter;
