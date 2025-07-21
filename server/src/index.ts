// Imports
import "reflect-metadata";
import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import debug, { Debugger } from "debug";
import dotenv from "dotenv";
import express, { Express, Response } from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";

// Local Imports
import { PORT as APP_PORT } from "./constants";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware";
import { requestLogging } from "./middlewares/request.middleware";
import { ApiRequest } from "./types";
import { cacheDeleteByPattern, cacheHealthCheck } from "./utils/redis.utils";
import { dbHealthCheck } from "./utils/db.utils";
import { ApiRateLimiter } from "./utils/rate-limit";
import { apiV1Router } from "./router";

// ----------------------------------------------
//  Configuration
// ----------------------------------------------
dotenv.config();
const app: Express = express();
const PORT = APP_PORT;
let dbr: Debugger;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const setupDebugger = (isProd: boolean = false) => {
  if (isProd) {
    dbr = debug("production");
    dbr("Production Debugger Mode");
  } else {
    dbr = debug("development");
    dbr("Development Debugger Mode");
  }
};
// ----------------------------------------------
//  Routes
// ----------------------------------------------
app.get("/", requestLogging, (req: ApiRequest, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: "Project API" });
});

app.get("/api/v1/ping", requestLogging, (req: ApiRequest, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: "Pong" });
});

// ADD Application Routes Here
app.use("/api/v1", ApiRateLimiter, requestLogging, apiV1Router);

app.use("*", (req: ApiRequest, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: "Invalid Route." });
});

app.use(errorHandlerMiddleware);

const start = () => {
  try {
    process.env.NODE_ENV === "development"
      ? setupDebugger()
      : setupDebugger(true);

    app.listen(PORT || 3000, async () => {
      console.log(`\n---------- Server Running on PORT ${PORT} ----------`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`BASE_URL: ${config.get("express.BASE_URL")}`);
      console.log(`Database Health: ${await dbHealthCheck()}`);
      console.log(`Redis Health: ${await cacheHealthCheck()}`);
      cacheDeleteByPattern("*");
    });
  } catch (error) {
    console.log("Unable to start server: ", error);
    process.exit(1);
  }
};

start();
