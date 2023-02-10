import express from "express";
import { signup } from "../../controllers/userController";

const router = express.Router();

router.post("/api/users/signup", signup);

export { router as userRoutes };
