import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/errorhandler.js";

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: string[] = [];

  errors.array().forEach((err) => {
    extractedErrors.push(err.msg);
  });

  throw new ApiError(422, "Received data is not valid", extractedErrors);
};
