// service bugetstatusService.js
import { getConnection } from '../database/database.js';

// Obtener presupuestos paginados con sus ítems
const getPaginatedBudgets = async (limit = 20, offset = 0) => {
  let connection;
  try {
    connection = await getConnection();

    // 1. Presupuestos + info del cliente y vendedor
    const [budgetRows] = await connection.query(`
      SELECT
        p.IdCliente,
        p.Tipo,
        p.Empresa,
        p.NroInterno,
        p.FechaALTA,
        p.MontoComprobante,
        c.Nombre AS NombreCliente,
        c.Domicilio,
        c.CUIT,
        c.IVA_Tipo,
        u.Nombre AS NombreVendedor
      FROM presupuestos p
      LEFT JOIN clientes c ON p.IdCliente = c.IdCliente
      LEFT JOIN usuarios u ON p.IdVendedor = u.IdVendedor
      ORDER BY p.FechaALTA DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    if (budgetRows.length === 0) return [];

    // 2. Traer todos los ítems con un solo query
    const nroInternos = budgetRows.map(b => b.NroInterno);
    const [itemsRows] = await connection.query(
      "SELECT * FROM presupuestos_articulos WHERE NroInterno IN (?)",
      [nroInternos]
    );

    // 3. Agrupar ítems por NroInterno
    const itemsGrouped = itemsRows.reduce((acc, item) => {
      if (!acc[item.NroInterno]) acc[item.NroInterno] = [];
      acc[item.NroInterno].push(item);
      return acc;
    }, {});

    // 4. Unir presupuestos con sus ítems
    const budgetsWithItems = budgetRows.map(budget => ({
      ...budget,
      items: itemsGrouped[budget.NroInterno] || [],
    }));

    return budgetsWithItems;
  } catch (err) {
    console.error(`Error al obtener presupuestos paginados: ${err.message}`);
    throw new Error('Error al obtener presupuestos paginados');
  }
};

// Actualizar el estado del presupuesto
const updateBudgetState = async (nroInterno, estado) => {
  if (!nroInterno || !estado) {
    throw new Error('NroInterno y nuevo estado son requeridos');
  }

  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      "UPDATE presupuestos SET Tipo = ? WHERE NroInterno = ? AND Tipo = 10",
      [estado, nroInterno]
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

// Exportar correctamente
export const methods = {
  getPaginatedBudgets,
  updateBudgetState,
};
