// Imports
import { Response } from "express";
import { rateLimit } from "express-rate-limit";
import { StatusCodes } from "http-status-codes";
import { ApiRequest } from "../types";

/**
 * API Rate Limiter Configuration
 *
 * @constant {Object} ApiRateLimiter
 * @description
 * This configuration object defines rate limiting settings for API reqs.
 * Please look at https://express-rate-limit.mintlify.app/overview for the docs
 *
 */
export const ApiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  skipFailedRequests: false,
  standardHeaders: true, // Return rate limit infor in the `RateLimit-*` headers
  keyGenerator: (req) => {
    return `${req.protocol}://${req.hostname}${req.originalUrl}`;
  },
  message: async (req: ApiRequest, res: Response) => {
    console.log(
      `\n${req.protocol}://${req.hostname}${req.originalUrl} [${req.method}] -> API is Rate-limited`
    ); // TODO: replace to be the logger

    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      msg: "IP rate limit exceeded, retry in 15 minutes.",
    });
  },
});
