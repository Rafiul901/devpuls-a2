
import jwt from "jsonwebtoken";
import config from "../../config/index.js";
import type { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "NO Token!",
      });
    }

    const token = authHeader;

    const decoded = jwt.verify(token, config.jwt_secret as string);

    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Expired ot invalid",
    });
  }
};