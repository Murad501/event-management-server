"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const event_controller_1 = require("./event.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), event_controller_1.EventController.CreateEvent);
router.get("/my-events", (0, auth_1.default)(), event_controller_1.EventController.getMyEvents);
router.delete("/:id", (0, auth_1.default)(), event_controller_1.EventController.deleteEvent);
router.patch("/:id", (0, auth_1.default)(), event_controller_1.EventController.UpdateEvent);
router.get("/:id", event_controller_1.EventController.GetEvent);
router.get("/", event_controller_1.EventController.getAllEvents);
exports.EventRoutes = router;
