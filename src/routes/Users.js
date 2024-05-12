import { Router } from "express";
import { methods as userController } from "../controllers/UserController";

const router = Router();

router.get("/", userController.getUserList);
router.get("/search/by-id/:userId", userController.getUserById);

export default router;
