import { getConnection } from "../database/database";

const getInvoiceData = async (req) => {
  try {
    const { invoiceNumber } = req.params;
    const connection = await getConnection();

    const query = `
            SELECT 
                Letra,
                Boca,
                Numero,
                IdCliente,
                NroInterno,
                CAE_VENCIMIENTO,
                CAE,
                Subtotal2,
                Total,
                CodAfip
            FROM facturas
            WHERE Numero = ?`;

    const [results] = await connection.query(query, [invoiceNumber]);

    await connection.end();
    return results;
  } catch (err) {
    console.log("Error en la consulta:", err);
    return { error: err.message };
  }
};

export const getInvoice = {
  getInvoiceData,
};
