import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorProd = (err: any, req: Request, res: Response) => {
  console.error("ERROR", err);

  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      console.log("reached here");
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
  }

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  sendErrorProd(error, req, res);
};
