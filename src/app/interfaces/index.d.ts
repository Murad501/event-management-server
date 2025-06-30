import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | null;
    }
  }
}


declare module "express-serve-static-core" {
  interface Request {
    user?: string;
  }
}