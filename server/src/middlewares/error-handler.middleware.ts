// Imports
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiRequest } from "../types";

const errorHandlerMiddleware = (
  err: any,
  req: ApiRequest,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "Something Went Wrong, Try Again Later";
  res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;
