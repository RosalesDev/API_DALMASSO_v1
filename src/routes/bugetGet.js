import { Router } from "express";
import getAllBudgets from '../controllers/bugetGetController';
import updateBudgetState from '../controllers/bugetGetController'; // Importa el nuevo controlador

const router = Router();

router.get("/", async (req, res) => {
  try {
    const budgets = await getAllBudgets();
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para actualizar el estado del presupuesto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    await updateBudgetState(id, estado);
    res.status(200).send({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
