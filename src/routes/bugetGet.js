import { Router } from 'express';
import { methods as budgetController } from '../controllers/bugetGetController.js'; 

const router = Router();

// Obtener presupuestos paginados: ?limit=20&offset=0
router.get("/", budgetController.getBudgets);

// Cambiar estado del presupuesto por NroInterno
router.put("/:nroInterno", budgetController.changeBudgetState);

export default router;
