import express from "express";
import {
  signup,
  signin,
  resetPassword,
  forgotPassword,
} from "../../controllers/userController";

const router = express.Router();

router.post("/api/users/signup", signup);
router.post("/api/users/signin", signin);
router.post("/api/users/forgot-password", forgotPassword);
router.patch("/api/users/reset-password/:token", resetPassword);

export { router as userRoutes };
