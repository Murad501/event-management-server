"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const user_controller_1 = require("../user/user.controller");
const router = express_1.default.Router();
router.post("/sign-up", user_controller_1.UserController.CreateUser);
router.post("/sign-in", auth_controller_1.AuthController.userLogin);
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
exports.AuthRoutes = router;
