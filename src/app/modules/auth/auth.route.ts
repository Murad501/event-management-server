import express from "express";
import { AuthController } from "./auth.controller";
import { UserController } from "../user/user.controller";

const router = express.Router();

router.post(
  "/sign-up",
  UserController.CreateUser
);

router.post("/sign-in", AuthController.userLogin);

router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
