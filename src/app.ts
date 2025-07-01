import express, { Application, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// test route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Event Management Server is running successfully!",
    timestamp: new Date().toISOString()
  });
});

// routes
app.use("/api/v1/", routes);

// global error handler
app.use(globalErrorHandler);

// handle not found route response
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
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

export default app;
