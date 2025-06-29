import mongoose from "mongoose";
import config from "./config";
import app from "./app";
import { Server } from "http";

process.on("uncaughtException", (error) => {
  console.log("from uncaughtException", error);
  process.exit(1);
});

let server: Server;
async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`);
    });

    console.log("✊ Database connected successfully");
  } catch (error) {
    console.log("Failed to connect database", error);
  }

  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        console.log("from unhandledRejection", error);
        process.exit(1);
      });
    }
  });
}

bootstrap();

process.on("SIGTERM", () => {
  console.log("SIGTERM is received");
  if (server) {
    server.close();
  }
});