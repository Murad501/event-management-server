import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth(), UserController.getAllUsers);

export const UserRoutes = router;