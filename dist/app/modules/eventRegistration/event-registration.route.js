"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistrationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const event_registration_controller_1 = require("./event-registration.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), event_registration_controller_1.EventRegistrationController.Register);
router.delete("/", (0, auth_1.default)(), event_registration_controller_1.EventRegistrationController.RemoveRegister);
router.get("/check/:event", (0, auth_1.default)(), event_registration_controller_1.EventRegistrationController.CheckRegistration);
exports.EventRegistrationRoutes = router;
