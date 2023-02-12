import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class AuthToken {
  user: any;
  statusCode: number;
  res: Response;
  token: any;
  expirationTime: Date;
  expiresIn: number;

  signToken(id: string) {
    const jwtSecret: Secret = process.env.JWT_SECRET!;
    return jwt.sign({ id }, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN_HOURS,
    });
  }

  constructor(user: any, statusCode: number, res: Response) {
    const JWT_EXPIRES_IN: number = parseInt(process.env.JWT_EXPIRES_IN_HOURS!);

    this.user = user;
    this.statusCode = statusCode;
    this.res = res;
    this.token = this.signToken(user._id);
    this.expirationTime = new Date(
      Date.now() + JWT_EXPIRES_IN * 60 * 60 * 1000
    );
    this.expiresIn = JWT_EXPIRES_IN * 60 * 60 * 1000;
    this.user.password = undefined;
  }

  async send() {
    return this.res.status(this.statusCode).json({
      status: "success",
      token: this.token,
      expiresIn: this.expiresIn,
      expirationTime: this.expirationTime,
      user: this.user,
    });
  }
}
