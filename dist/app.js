"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Event Management Server is running successfully!",
        timestamp: new Date().toISOString()
    });
});
// routes
app.use("/api/v1/", routes_1.default);
// global error handler
app.use(globalErrorHandler_1.default);
// handle not found route response
app.use((req, res) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "Route not found",
        errorMessage: [
            {
                path: req.originalUrl,
                message: "api not found",
            },
        ],
    });
});
exports.default = app;
