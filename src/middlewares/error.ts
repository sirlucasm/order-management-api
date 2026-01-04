import type { NextFunction } from "express";
import type { Request, Response } from "express";
import { ErrorResponse } from "../lib/classes/error";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };

  const errorResponse = new ErrorResponse(
    error.message || "Internal server error",
    error.statusCode || 500,
    err
  );

  console.error(err);

  res
    .status(errorResponse.statusCode || 500)
    .json(errorResponse.serializeErrors());
};
