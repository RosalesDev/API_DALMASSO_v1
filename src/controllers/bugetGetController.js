import { getConnection } from '../database/database';

const getAllBudgets = async () => {
  let connection;
  try {
    console.log('Obteniendo todos los presupuestos');
    connection = await getConnection();

    const [budgetRows] = await connection.query("SELECT * FROM presupuestos");
    console.log('Resultados de la consulta de presupuestos:', budgetRows);

    if (budgetRows.length === 0) {
      console.log('No se encontró ningún presupuesto');
      return [];
    }

    const budgetsWithItems = await Promise.all(
      budgetRows.map(async (budget) => {
        const [itemsRows] = await connection.query(
          "SELECT * FROM presupuestos_articulos WHERE NroInterno = ?",
          [budget.NroInterno]
        );
        console.log(`Artículos encontrados para NroInterno ${budget.NroInterno}:`, itemsRows);

        return {
          ...budget,
          items: itemsRows,
        };
      })
    );

    return budgetsWithItems;
  } catch (err) {
    console.error(`Error al obtener los presupuestos: ${err.message}`);
    throw new Error(`Error al obtener los presupuestos: ${err.message}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export default getAllBudgets;
