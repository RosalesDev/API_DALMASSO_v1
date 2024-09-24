import { Router } from "express";
import { methods as companyController } from "../controllers/CompanyController";
import authenticateToken from "../middleware/authMiddleware";

const router = Router();

router.get("/companyList", authenticateToken, companyController.getCompanyList);

export default router;
