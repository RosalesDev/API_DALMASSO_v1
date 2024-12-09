import { getConnection } from "../database/database";

const getInvoicesByClientId = async (idCliente) => {
  try {
    const connection = await getConnection();

    const query = `
      SELECT
        Letra,
        Boca,
        Numero,
        Fecha,
        IdCliente,
        NombreCondVenta,
        Iva_Tipo,
        DescuentoTotal,
        NroInterno,
        Pagada,
        MontoComprobante,
        PercepcionIIBB,
        CAE_VENCIMIENTO,
        CAE,
        Subtotal2,
        Total,
        CodAfip
      FROM facturas
      WHERE IdCliente = ?
    `;
 console.log(getInvoicesByClientId);
    const [results] = await connection.query(query, [idCliente]);

    
    if (results && results.length > 0) {
      return results;
    } else {
      throw new Error('Facturas no encontradas');
    }
  } catch (err) {
    console.error("Error en la consulta:", err);
    throw err;
  }
};

export const getInvoice = {
  getInvoicesByClientId,
};
