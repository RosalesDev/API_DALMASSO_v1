import { Router } from "express";
import { methods as InvoiceController } from "../controllers/InvoiceController";
import authenticateToken from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/by-number/:invoiceNumber",
  authenticateToken,
  InvoiceController.getInvoice
);

export default router;
