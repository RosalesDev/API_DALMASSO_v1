import { methods as budgetService } from '../services/bugetsStatusService.js';

const getBudgets = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const budgets = await budgetService.getPaginatedBudgets(limit, offset);
    res.json(budgets);
  } catch (err) {
    console.error(`Error al obtener presupuestos: ${err.message}`);
    res.status(500).json({ message: 'Error al obtener los presupuestos' });
  }
};

const changeBudgetState = async (req, res) => {
  const { nroInterno } = req.params;
  const { estado } = req.body;

  try {
    const result = await budgetService.updateBudgetState(nroInterno, estado);
    res.json(result);
  } catch (err) {
    console.error(`Error al actualizar estado: ${err.message}`);
    res.status(500).json({ message: 'Error al actualizar estado del presupuesto' });
  }
};

export const methods = {
  getBudgets,
  changeBudgetState,
};
