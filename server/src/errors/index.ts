import { StatusCodes } from "http-status-codes";

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = StatusCodes.NOT_FOUND;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = StatusCodes.BAD_REQUEST;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthenticatedError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "UnauthenticatedError";
    this.statusCode = StatusCodes.UNAUTHORIZED;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = StatusCodes.FORBIDDEN;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = StatusCodes.BAD_REQUEST;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    Error.captureStackTrace(this, this.constructor);
  }
}
