import {getConnection} from '../database/database';

export const getStockFisicoService = async (IdProd, IEmp, ISuc) => {
  let cSTK = 0;

  // 1️⃣ Resta (salidas)
  const [salidas] = await db.query(`
    SELECT SUM(fa.Cantidad) as cantidad
    FROM Facturas fac
    INNER JOIN Facturas_Articulos fa ON fac.NroInterno = fa.NroInterno
    INNER JOIN Productos p ON fa.IdProducto = p.IdProducto
    WHERE fa.IdProducto = ?
      AND fa.IdCombinacion = 0
      AND p.BajaStock = 'S'
      AND (fac.AfectaStock <> 'N' OR fac.AfectaStock IS NULL)
      AND (fac.Anulada <> 'S' OR fac.Anulada IS NULL)
      AND fac.tipo IN (1,2,5,6,11)
      AND fac.empresa = ?
      AND fac.Sucursal = ?
  `, [IdProd, IEmp, ISuc]);

  if (salidas[0]?.cantidad) {
    cSTK -= salidas[0].cantidad;
  }

  // 2️⃣ Suma (entradas)
  const [entradas] = await db.query(`
    SELECT SUM(fa.Cantidad) as cantidad
    FROM Facturas fac
    INNER JOIN Facturas_Articulos fa ON fac.NroInterno = fa.NroInterno
    INNER JOIN Productos p ON fa.IdProducto = p.IdProducto
    WHERE fa.IdProducto = ?
      AND fa.IdCombinacion = 0
      AND p.BajaStock = 'S'
      AND (fac.AfectaStock <> 'N' OR fac.AfectaStock IS NULL)
      AND (fac.Anulada <> 'S' OR fac.Anulada IS NULL)
      AND fac.tipo IN (0,3,4,7,16)
      AND fac.empresa = ?
      AND fac.Sucursal = ?
  `, [IdProd, IEmp, ISuc]);

  if (entradas[0]?.cantidad) {
    cSTK += entradas[0].cantidad;
  }

  return cSTK;
};
