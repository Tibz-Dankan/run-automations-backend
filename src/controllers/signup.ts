import express, { Request, Response, NextFunction } from "express";
import { User } from "../../models/user";
import { AppError } from "../../utils/error";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthToken } from "../../utils/token";

const router = express.Router();

router.post(
  "/api/users/signup",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (user) return next(new AppError("Email already registered", 400));

    const newUser = User.build({ username, email, password });
    await newUser.save();

    await new AuthToken(newUser, 201, res).send();
  })
);

export { router as signupRouter };
