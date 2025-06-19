//service bugetstatusService.js
import { getConnection } from '../database/database.js';

 const getAllBudgets = async () => {
  let connection;
  try {
    connection = await getConnection();

    const [budgetRows] = await connection.query(`
      SELECT
        p.IdCliente,
        p.Tipo,
        p.Empresa,
        p.NroInterno,
        p.FechaALTA,
        p.MontoComprobante,
        p.NroInterno,      
        c.Nombre AS NombreCliente,
        c.Domicilio,
        c.CUIT,
        c.IVA_Tipo,
        u.Nombre AS NombreVendedor
      FROM presupuestos p
      LEFT JOIN clientes c ON p.IdCliente = c.IdCliente
      LEFT JOIN usuarios u ON p.IdVendedor = u.IdVendedor
    `);

    if (budgetRows.length === 0) return [];

    const budgetsWithItems = await Promise.all(
      budgetRows.map(async (budget) => {
        const [itemsRows] = await connection.query(
          "SELECT * FROM presupuestos_articulos WHERE NroInterno = ?",
          [budget.NroInterno]
        );
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
  }
};
const updateBudgetState = async (id, estado) => {
  if (!id || !estado) {
    throw new Error('ID del cliente y nuevo estado son requeridos');
  }

  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      "UPDATE presupuestos SET Tipo = ? WHERE IdCliente = ? AND Tipo = 10",
      [estado, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('No se encontró el presupuesto o ya ha sido procesado');
    }

    return { message: 'Estado del presupuesto actualizado correctamente' };
  } catch (err) {
    console.error(`Error al actualizar el estado del presupuesto: ${err.message}`);
    throw new Error('Error interno del servidor');
  }
};


export const methods = {
  getAllBudgets,
  updateBudgetState,
};