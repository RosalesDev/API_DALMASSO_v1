import { Router } from 'express';
import { getAllBudgets, updateBudgetState } from '../controllers/bugetGetController.js';

const router = Router();

router.get("/", async (req, res) => {
  try {
    const budgets = await getAllBudgets();
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const result = await updateBudgetState(id, estado);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
