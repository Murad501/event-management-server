import express from "express";
import auth from "../../middlewares/auth";
import { EventController } from "./event.controller";

const router = express.Router();

router.post("/", auth(), EventController.CreateEvent);
router.delete("/:id", auth(), EventController.deleteEvent);
router.patch("/:id", auth(), EventController.UpdateEvent);
router.get("/:id", EventController.GetEvent);
router.get("/", EventController.getAllEvents);

export const EventRoutes = router;
