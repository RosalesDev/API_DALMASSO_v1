import express from "express";
import { getStockFisico } from "../controllers/stockController.js";

const router = express.Router();

// GET /api/stock/123/1/2
router.get("/:IdProd/:IEmp/:ISuc", getStockFisico);

export default router;
