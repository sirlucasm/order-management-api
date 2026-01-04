import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ErrorResponse } from "../lib/classes/error";
import { User } from "../lib/mongoose/schemas";
import type { JwtPayload } from "../_types/jwt";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ErrorResponse("Unauthenticated", 401);
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  if (!decoded) {
    throw new ErrorResponse("Token is invalid", 401);
  }

  const user = await User.findById(decoded.id).exec();

  if (!user) {
    throw new ErrorResponse("Unauthenticated", 401);
  }

  req.user = {
    id: user.id,
    email: user.email,
  };

  next();
};
