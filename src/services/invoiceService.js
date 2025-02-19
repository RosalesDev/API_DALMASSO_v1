import { getConnection } from "../database/database";

const getInvoicesByClientId = async (idCliente) => {
  try {
    const connection = await getConnection();

    const query = `
    SELECT
    f.Letra,
    f.Boca,
    f.Numero,
    f.Fecha,
    f.IdCliente,
    f.NombreCondVenta,
    f.Tipo,
    f.Iva_Tipo,
    xt.TipoIva AS Iva_Tipo_Descripcion,
    f.DescuentoTotal,
    f.NroInterno,
    f.Pagada,
    f.MontoComprobante,
    f.PercepcionIIBB,
    f.CAE_VENCIMIENTO,
    f.CAE,
    f.Subtotal2,
    f.Total,
    f.CodAfip,
    fa.IdProducto,
    fa.Cantidad,
    fa.Detalle,
    fa.Precio,
    fa.Importe,
    fa.Descuento,
    fa.alic_iva,
    (SELECT SUM(fa2.Importe * (fa2.alic_iva / 100))
     FROM facturas_articulos fa2
     WHERE fa2.NroInterno = f.NroInterno) AS IVA_Discriminado
FROM facturas f
LEFT JOIN facturas_articulos fa ON f.NroInterno = fa.NroInterno
LEFT JOIN xtipoiva xt ON f.Iva_Tipo = xt.Codigo
WHERE f.IdCliente = ?
    `;

    const [results] = await connection.query(query, [idCliente]);

    if (results && results.length > 0) {
      const invoices = {};

      results.forEach(row => {
        const { NroInterno, ...invoiceData } = row;
        const { IdProducto, Cantidad, Detalle, Precio, Importe, Descuento, alic_iva, IVA_Discriminado, Subtotal2, Total, ...rest } = invoiceData;

        if (!invoices[NroInterno]) {
          invoices[NroInterno] = {
            ...rest,
            articulos: [],
            IVA_Discriminado: IVA_Discriminado ? parseFloat(IVA_Discriminado).toFixed(2) : 0.00,  // Formatear el IVA discriminado
            Subtotal2: Subtotal2 ? parseFloat(Subtotal2).toFixed(2) : 0.00,
            Total: Total ? parseFloat(Total).toFixed(2) : 0.00
          };
        }

        if (IdProducto) {
          invoices[NroInterno].articulos.push({
            IdProducto,
            Cantidad,
            Detalle,
            Precio,
            Importe,
            Descuento,
            alic_iva
          });
        }
      });

      return Object.values(invoices);
    } else {
      throw new Error('Facturas no encontradas');
    }
  } catch (err) {
    console.error("Error en la consulta:", err);
    throw err;
  }
};

// Acceso público
const getInvoiceByPublicParams = async (IdCliente, Nombre) => {
  try {
    console.log(`Parámetros recibidos: IdCliente=${IdCliente}, Nombre=${Nombre}`);

    const connection = await getConnection();

    // Primero, verificar que el cliente existe
    const clientQuery = `
    SELECT IdCliente FROM clientes WHERE IdCliente = ? AND Nombre = ?
    `;

    const [clientResults] = await connection.query(clientQuery, [IdCliente, Nombre]);

    if (clientResults.length === 0) {
      throw new Error('Cliente no encontrado');
    }

    // Luego, buscar las facturas del cliente
    const invoiceQuery = `
    SELECT
      f.Letra,
      f.Boca,
      f.Numero,
      f.Fecha,
      f.IdCliente,
      f.NombreCondVenta,
      f.Tipo,
      f.Iva_Tipo,
      xt.TipoIva AS Iva_Tipo_Descripcion,
      f.DescuentoTotal,
      f.NroInterno,
      f.Pagada,
      f.MontoComprobante,
      f.PercepcionIIBB,
      f.CAE_VENCIMIENTO,
      f.CAE,
      f.Subtotal2,
      f.Total,
      f.CodAfip,
      fa.IdProducto,
      fa.Cantidad,
      fa.Detalle,
      fa.Precio,
      fa.Importe,
      fa.Descuento,
      fa.alic_iva,
      (SELECT SUM(fa2.Importe * (fa2.alic_iva / 100))
       FROM facturas_articulos fa2
       WHERE fa2.NroInterno = f.NroInterno) AS IVA_Discriminado
    FROM facturas f
    LEFT JOIN facturas_articulos fa ON f.NroInterno = fa.NroInterno
    LEFT JOIN xtipoiva xt ON f.Iva_Tipo = xt.Codigo
    WHERE f.IdCliente = ?
    `;

    const [results] = await connection.query(invoiceQuery, [IdCliente]);

    console.log(`Resultados de la consulta:`, results);

    if (results && results.length > 0) {
      const invoices = {};

      results.forEach(row => {
        const { NroInterno, ...invoiceData } = row;
        const { IdProducto, Cantidad, Detalle, Precio, Importe, Descuento, alic_iva, IVA_Discriminado, Subtotal2, Total, ...rest } = invoiceData;

        if (!invoices[NroInterno]) {
          invoices[NroInterno] = {
            ...rest,
            articulos: [],
            IVA_Discriminado: IVA_Discriminado ? parseFloat(IVA_Discriminado).toFixed(2) : 0.00,  // Formatear el IVA discriminado
            Subtotal2: Subtotal2 ? parseFloat(Subtotal2).toFixed(2) : 0.00,
            Total: Total ? parseFloat(Total).toFixed(2) : 0.00
          };
        }

        if (IdProducto) {
          invoices[NroInterno].articulos.push({
            IdProducto,
            Cantidad,
            Detalle,
            Precio,
            Importe,
            Descuento,
            alic_iva
          });
        }
      });

      return Object.values(invoices);
    } else {
      throw new Error('Factura no encontrada');
    }
  } catch (err) {
    console.error("Error en la consulta para acceso público:", err);
    throw err;
  }
};

export const getInvoice = {
  getInvoicesByClientId,
  getInvoiceByPublicParams,
};
