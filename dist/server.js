"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const env_1 = require("./constants/env");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const db_1 = __importDefault(require("./utils/db"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const session_route_1 = __importDefault(require("./routes/session.route"));
const authenticate_1 = require("./middlewares/authenticate");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send('<h1>Welcome to Auth ts</h1>');
});
app.use("/api/auth", auth_route_1.default);
app.use("/api/user", authenticate_1.authenticate, user_route_1.default);
app.use("/api/session", authenticate_1.authenticate, session_route_1.default);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler_1.default);
app.listen(env_1.PORT, () => {
    (0, db_1.default)();
    console.log(`server is running on http://localhost:${env_1.PORT}`);
});
