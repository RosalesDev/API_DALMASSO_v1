import { getConnection } from "../database/database";

// 🔹 Servicio privado: facturas por ID de cliente
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
        const {
          IdProducto, Cantidad, Detalle, Precio, Importe, Descuento,
          alic_iva, IVA_Discriminado, Subtotal2, Total, ...rest
        } = invoiceData;

        if (!invoices[NroInterno]) {
          invoices[NroInterno] = {
            ...rest,
            articulos: [],
            IVA_Discriminado: IVA_Discriminado !== null ? parseFloat(IVA_Discriminado).toFixed(2) : "0.00",
            Subtotal2: Subtotal2 !== null ? parseFloat(Subtotal2).toFixed(2) : "0.00",
            Total: Total !== null ? parseFloat(Total).toFixed(2) : "0.00"
          };
        }

        if (IdProducto !== null) {
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
      return [];
    }
  } catch (err) {
    console.error("❌ Error en getInvoicesByClientId:", err.message);
    throw err;
  }
};

// 🔹 Servicio público: facturas por Número y Cuit
const getInvoiceByPublicParams = async (Numero, Cuit) => {
  try {
    console.log(`📥 Parámetros recibidos: Numero=${Numero}, Cuit=${Cuit}`);

    const connection = await getConnection();

    //  obtener datos del cliente
    const clientQuery = `
      SELECT IdCliente, Nombre, Domicilio, CUIT FROM clientes WHERE Numero = ? AND Cuit = ?
    `;
    const [clientResults] = await connection.query(clientQuery, [Numero, Cuit]);

    if (!clientResults || clientResults.length === 0) {
      console.warn(`⚠️ Cliente no encontrado: Numero=${Numero}, Cuit=${Cuit}`);
      return { facturas: [], saldosPorSucursal: [], error: "Cliente no encontrado" };
    }

    const clientData = clientResults[0];
    const clientId = clientData.IdCliente;

    //  obtener las facturas del cliente
    const invoiceQuery = `
      SELECT
        f.Letra, f.Boca, f.Numero, f.Fecha, f.IdCliente, f.NombreCondVenta,
        f.Tipo, f.Iva_Tipo, xt.TipoIva AS Iva_Tipo_Descripcion,
        f.DescuentoTotal, f.NroInterno, f.Pagada, f.MontoComprobante,
        f.PercepcionIIBB, f.CAE_VENCIMIENTO, f.CAE, f.Subtotal2, f.Total, f.CodAfip,
        fa.IdProducto, fa.Cantidad, fa.Detalle, fa.Precio, fa.Importe,
        fa.Descuento, fa.alic_iva,
        (SELECT SUM(fa2.Importe * (fa2.alic_iva / 100))
         FROM facturas_articulos fa2
         WHERE fa2.NroInterno = f.NroInterno) AS IVA_Discriminado
      FROM facturas f
      LEFT JOIN facturas_articulos fa ON f.NroInterno = fa.NroInterno
      LEFT JOIN xtipoiva xt ON f.Iva_Tipo = xt.Codigo
      WHERE f.IdCliente = ?
    `;
    const [results] = await connection.query(invoiceQuery, [clientId]);

    if (!results || results.length === 0) {
      console.warn(`⚠️ No se encontraron facturas para IdCliente=${clientId}`);
      return { facturas: [], saldosPorSucursal: [], error: "Facturas no encontradas para el cliente" };
    }

    // Paso 3: obtener saldos por sucursal
    const saldoQuery = `
      SELECT e.Nombre AS nombreSucursal, c.sucursal, SUM(c.Debe - c.Haber) AS saldo
      FROM ctacte c
      JOIN empresas e ON c.sucursal = e.CodEmpresa
      WHERE c.IdCliente = ?
      GROUP BY c.sucursal, e.Nombre
    `;
    const [saldos] = await connection.query(saldoQuery, [clientId]);

    // Paso 4: organizar facturas
    const invoices = {};
    results.forEach(row => {
      const { NroInterno, ...invoiceData } = row;
      const {
        IdProducto, Cantidad, Detalle, Precio, Importe, Descuento,
        alic_iva, IVA_Discriminado, Subtotal2, Total, ...rest
      } = invoiceData;

      if (!invoices[NroInterno]) {
        invoices[NroInterno] = {
          ...rest,
          articulos: [],
          IVA_Discriminado: IVA_Discriminado !== null ? parseFloat(IVA_Discriminado).toFixed(2) : "0.00",
          Subtotal2: Subtotal2 !== null ? parseFloat(Subtotal2).toFixed(2) : "0.00",
          Total: Total !== null ? parseFloat(Total).toFixed(2) : "0.00",
          Nombre: clientData.Nombre,
          Domicilio: clientData.Domicilio,
          CUIT: clientData.CUIT
        };
      }

      if (IdProducto !== null) {
        invoices[NroInterno].articulos.push({
          IdProducto, Cantidad, Detalle, Precio, Importe, Descuento, alic_iva
        });
      }
    });

    return {
      facturas: Object.values(invoices),
      saldosPorSucursal: saldos || []
    };

  } catch (err) {
    console.error("❌ Error en getInvoiceByPublicParams:", err.message);
    return {
      facturas: [],
      saldosPorSucursal: [],
      error: "Error interno en el servidor",
      detalles: err.message
    };
  }
};


export const getInvoice = {
  getInvoicesByClientId,
  getInvoiceByPublicParams,
};
