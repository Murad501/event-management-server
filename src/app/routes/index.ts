import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { EventRoutes } from "../modules/event/event.route";
import { EventRegistrationRoutes } from "../modules/eventRegistration/event-registration.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/events",
    route: EventRoutes,
  },
  {
    path: "/events-registration",
    route: EventRegistrationRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
