import { getAllBudgets, updateBudgetState } from '../services/bugetsStatusService';

const getBudgets = async (req, res) => {
  try {
    const budgets = await getAllBudgets();
    res.json(budgets);
  } catch (err) {
    console.error(`Error al obtener presupuestos: ${err.message}`);
    res.status(500).json({ message: 'Error al obtener los presupuestos' });
  }
};

export const changeBudgetState = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const result = await updateBudgetState(id, estado);
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
