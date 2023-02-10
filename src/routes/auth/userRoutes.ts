import express from "express";
import { signup, signin } from "../../controllers/userController";

const router = express.Router();

router.post("/api/users/signup", signup);
router.post("/api/users/signin", signin);

export { router as userRoutes };
