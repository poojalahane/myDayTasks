// Imports
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Local Imports
import { container } from "../inversify.config";
import { Logger } from "winston";
import { ApiRequest } from "../types";

export const requestLogging = (
  req: ApiRequest,
  res: Response,
  next: NextFunction
) => {
  const logger: Logger = container.get<Logger>("requestLogger");
  logger.info({
    requestId: uuidv4(),
    requestMethod: req.method,
    requestBody: req.body,
    requestParams: req.params,
    requestQuery: req.query,
    requestFile: req.file,
    requestEndpoint: req.protocol + "://" + req.get("host") + req.originalUrl,
  });
  next();
};
