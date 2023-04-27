import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { AppError } from "../utils/error";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthToken } from "../utils/token";
import { Email } from "../utils/email";
import { createHash } from "crypto";

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);

    if (!username || !email || !password) {
      return next(new AppError("Please fill out all fields", 400));
    }
    if (!email.includes("@")) {
      return next(new AppError("Please supply a valid email", 400));
    }
    const user = await User.findOne({ email });
    if (user) return next(new AppError("Email already registered", 400));

    const newUser = User.build({ username, email, password });
    await newUser.save();

    await new AuthToken(newUser, 201, res).send();
  }
);

export const signin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return next(new AppError("Please fill out all fields", 400));
    }
    const user = await User.findOne({ email });
    if (!user || !(await User.correctPassword(password, user.password))) {
      return next(new AppError("Invalid email or password", 400));
    }
    await new AuthToken(user, 200, res).send();
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    if (!email) return next(new AppError("Please fill out all fields", 400));
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("There is no user with supplied email", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://localhost:3000/reset-password/${resetToken}`;
    const subject = "Reset Password";

    console.log("resetURL");
    console.log(resetURL);

    await new Email(email, subject).sendPasswordReset(resetURL, user.username);

    res.status(200).json({
      status: "success",
      message: "Password reset token sent to email",
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;
    if (!token) return next(new AppError("Please a reset token", 400));
    const hashedToken = createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await new AuthToken(user, 200, res).send();
  }
);
