import { getConnection } from '../database/database.js';

const getPaginatedBudgets = async (limit, offset) => {
  let connection;
  try {
    connection = await getConnection();

    console.log("⏳ Ejecutando consulta principal...");
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
      WHERE p.Tipo = 10
      ORDER BY p.FechaALTA DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    console.log("✅ Presupuestos encontrados:", budgetRows.length);

    const [[{ total }]] = await connection.query(`
      SELECT COUNT(*) as total FROM presupuestos WHERE Tipo = 10
    `);
    console.log("📦 Total de presupuestos tipo 10:", total);

    const budgetsWithItems = await Promise.all(
      budgetRows.map(async (budget) => {
        try {
          const [itemsRows] = await connection.query(
            "SELECT * FROM presupuestos_articulos WHERE NroInterno = ?",
            [budget.NroInterno]
          );
          console.log(`🧾 Ítems para NroInterno ${budget.NroInterno}:`, itemsRows.length);
          return {
            ...budget,
            items: itemsRows,
          };
        } catch (itemErr) {
          console.error(`❌ Error al obtener ítems para ${budget.NroInterno}:`, itemErr.message);
          return { ...budget, items: [] };
        }
      })
    );

    return { data: budgetsWithItems, total };
  } catch (err) {
    console.error(`❌ Error en getPaginatedBudgets: ${err.message}`);
    throw new Error(`Error al obtener presupuestos paginados: ${err.message}`);
  }
};

// ✅ Aseguramos que también está esto
const updateBudgetState = async (nroInterno, estado) => {
  if (!nroInterno || !estado) {
    throw new Error('NroInterno y estado son requeridos');
  }

  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      "UPDATE presupuestos SET Tipo = ? WHERE NroInterno = ? AND Tipo = 10",
      [estado, nroInterno]
    );

    if (result.affectedRows === 0) {
      throw new Error('No se encontró el presupuesto o ya fue procesado');
    }

    return { message: 'Estado actualizado correctamente' };
  } catch (err) {
    console.error(`❌ Error al actualizar presupuesto: ${err.message}`);
    throw new Error('Error interno del servidor');
  }
};

// ✅ Export final
export const methods = {
  getPaginatedBudgets,
  updateBudgetState,
};
