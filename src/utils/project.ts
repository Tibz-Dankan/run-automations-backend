import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./error";
import { asyncHandler } from "./asyncHandler";
const User = require("../models/user");
import dotenv from "dotenv";

dotenv.config();

export const protect = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    let token;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError("You are not logged! Please to get access", 400)
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findUserById(decoded.userId);
    if (!user) {
      return next(
        new AppError("The user belonging to this token no exists!", 403)
      );
    }
    // req.id = decoded.userId;
    // next();
    req["user"] = user;
    res.locals.user = user;
    next();
  }
);
