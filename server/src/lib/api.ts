// Imports
import { StatusCodes } from "http-status-codes";

/**
 * @class
 * ApiError
 *
 * @description
 * Common Error class to throw an error from anywhere.
 */
export class ApiError extends Error {
  statusCode?: number;
  errors?: Array<Error> = [];

  /**
   *
   * @param {number} statusCode
   * @param {string} message
   * @param {Error[]} errors
   * @param {string} stack
   */
  constructor(statusCode: StatusCodes, message: string, errors?: Array<Error>) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    if (errors) this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      msg: this.message,
      errors: this.errors,
      stack: this.stack,
    };
  }
}

/**
 * @class
 * ApiResponse
 *
 * @description
 * Represents the structure of API responses with a standardised format.
 */
export class ApiResponse {
  statusCode: StatusCodes;
  data: any;
  msg: string;

  /**
   * @constructor
   * @param {number} statusCode - HTTP status code of the response.
   * @param {any} data - Data to be included in the response.
   * @param {string} [message='Success'] - Message describing the result of the response.
   */
  constructor(statusCode: StatusCodes, data: any, msg: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.msg = msg;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      data: this.data,
      msg: this.msg,
    };
  }
}
