import { getConnection } from '../database/database';

// Función para obtener todos los presupuestos con Tipo 10
const getAllBudgets = async () => {
  let connection;
  try {
    console.log('Obteniendo todos los presupuestos con Tipo 10');
    connection = await getConnection();

    // Filtrar por Tipo
    const [budgetRows] = await connection.query(
      "SELECT IdCliente FROM presupuestos WHERE Tipo = ?",
      [10]
    );
    console.log('Resultados de la consulta de presupuestos:', budgetRows);

    if (budgetRows.length === 0) {
      console.log('No se encontró ningún presupuesto con Tipo 10');
      return [];
    }

    // Devolver solo los IdCliente
    return budgetRows.map(row => row.IdCliente);
  } catch (err) {
    console.error(`Error al obtener los presupuestos: ${err.message}`);
    throw new Error(`Error al obtener los presupuestos: ${err.message}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Función para actualizar el estado del presupuesto
const updateBudgetState = async (id, newState) => {
  let connection;
  try {
    connection = await getConnection();

    // Actualizar el estado del presupuesto en la base de datos
    await connection.query("UPDATE presupuestos SET Tipo = ? WHERE IdCliente = ?", [newState, id]);

    console.log(`Estado del presupuesto con IdCliente ${id} actualizado a ${newState}`);
  } catch (err) {
    console.error(`Error al actualizar el estado del presupuesto: ${err.message}`);
    throw new Error(`Error al actualizar el estado del presupuesto: ${err.message}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export { getAllBudgets, updateBudgetState };
