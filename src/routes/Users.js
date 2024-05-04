import { Router } from "express";
import { methods as UserList } from "../controllers/Users.list";

const router = Router();

router.get("/", UserList.getUsers);
router.get("/:uid", UserList.getUser);
// router.post("/", UserList.addUsers);

export default router;
