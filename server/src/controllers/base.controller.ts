// Imports
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { injectable } from "inversify";
import { Logger } from "winston";

// Local Imports
import { ApiError, ApiResponse } from "../lib/api";
import { ApiRequest } from "../types";

@injectable()
export abstract class BaseController<T> {
  protected abstract service: any; // Injected Service
  protected abstract logger: Logger; // Injected Logger

  constructor() {}

  protected handleError(res: Response, error: any) {
    this.logger.error(error.message);
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new ApiError(error.statusCode, error.message, error));
  }

  protected sendSuccess(res: Response, message: string, data?: T) {
    this.logger.info({ message, data });
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, data, message).toJSON());
  }

  async create(req: ApiRequest, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const result = await this.service.create(data);
      this.sendSuccess(res, "Successfully created", result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async update(req: ApiRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = req.body;
      const result = await this.service.update(id, data);
      this.sendSuccess(
        res,
        `Successfully updated record with ID ${id}`,
        result
      );
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getById(req: ApiRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await this.service.getById(id);
      if (!result) {
        this.handleError(res, {
          message: "Record not found",
          statusCode: StatusCodes.NOT_FOUND,
        });
      } else {
        this.sendSuccess(res, "Successfully retrieved record", result);
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async list(req: ApiRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.service.list();
      this.sendSuccess(res, "Successfully retrieved list", result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async delete(req: ApiRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await this.service.delete(id);
      this.sendSuccess(res, `Successfully deleted record with ID ${id}`);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
