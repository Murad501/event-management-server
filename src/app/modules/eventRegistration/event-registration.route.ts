import express from "express";
import auth from "../../middlewares/auth";
import { EventRegistrationController } from "./event-registration.controller";

const router = express.Router();

router.post("/", auth(), EventRegistrationController.Register);
router.delete("/", auth(), EventRegistrationController.RemoveRegister);

export const EventRegistrationRoutes = router;
