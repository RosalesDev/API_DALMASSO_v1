import { Router } from "express";
import { methods as getInvoiceController } from "../controllers/getInvoiceController"; 
import authenticateToken from "../middleware/authMiddleware";

const router = Router();


router.get("/", authenticateToken, getInvoiceController.getInvoice);

export default router;
