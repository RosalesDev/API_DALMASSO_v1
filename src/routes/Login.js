import { Router } from "express";
import { methods as authController } from "../controllers/AuthController";

const router = Router();

router.post("/auth", authController.login);

export default router;
