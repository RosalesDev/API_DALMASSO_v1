import { getConnection } from '../database/database';

/**
 * Obtiene todos los presupuestos con Tipo = 10.
 */
export const getAllBudgets = async () => {
  let connection;
  try {
    console.log('Obteniendo todos los presupuestos con Tipo 10');
    connection = await getConnection();

    const [budgetRows] = await connection.query(
      "SELECT p.IdCliente, p.Tipo, p.Empresa, p.NroInterno, p.FechaALTA, p.MontoComprobante, c.Nombre AS NombreCliente, c.Domicilio, c.CUIT, c.IVA_Tipo, u.Nombre AS NombreVendedor FROM presupuestos p LEFT JOIN clientes c ON p.IdCliente = c.IdCliente LEFT JOIN usuarios u ON p.IdVendedor = u.IdUsuario WHERE p.Tipo = ?",
      [10]
    );

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
  } finally {
    if (connection) await connection.end();
  }
};

/**
 * Actualiza el estado de un presupuesto.
 */
export const updateBudgetState = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!id || !estado) {
    return res.status(400).json({ message: 'ID del cliente y nuevo estado son requeridos' });
  }

  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      "UPDATE presupuestos SET Tipo = ? WHERE IdCliente = ? AND Tipo = 10",
      [estado, id]
    );

    if (result.affectedRows === 0) {
      console.warn(`No se actualizó el presupuesto con IdCliente ${id}. Puede que ya haya sido procesado o no exista.`);
      return res.status(404).json({ message: 'No se encontró el presupuesto o ya ha sido procesado' });
    }

    console.log(`✅ Estado del presupuesto con IdCliente ${id} actualizado a ${estado}`);
    return res.json({ message: 'Estado del presupuesto actualizado correctamente' });
  } catch (err) {
    console.error(`Error al actualizar el estado del presupuesto: ${err.message}`, err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    if (connection) await connection.end();
  }
};


export { getAllBudgets, updateBudgetState };
