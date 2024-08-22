import { getConnection } from "../database/database";

// obtener el último NroInterno generado
const getLastNroInterno = async () => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT NroInterno FROM presupuestos ORDER BY NroInterno DESC LIMIT 1");
    return rows.length ? rows[0].NroInterno : 0;
  } catch (err) {
    throw new Error(`Error al obtener el último NroInterno: ${err.message}`);
  }
};

// añadir un nuevo presupuesto
const addBuget = async (req, res) => {
  try {
    const {
      Empresa,
      Sucursal,
      Tipo,
      Letra,
      Boca,
      Numero,
      DescuentoTotal,
      IdCliente,
      IdVendedor,
      VendedorComision,
      Obs,
      Condicion,
      Anulada,
      Remito,
      Iva_Tipo,
      IdLista,
      Factura,
      UserMOD,
      UserALTA,
      UserBAJA,
      AfectaStock,
      NombreCondVenta,
      Anterior,
      Siguiente,
      Moneda,
      MonedaCotizacion,
      EnMostrador,
      InteresIVA,
      InteresMonto,
      InteresPorcentaje,
      IdFinanciacion,
      FechaPrimeraCuota,
      IdCategoria,
      IdSubCategoria,
      RecargoTotal,
      RecargoPorc,
      RecargoMonto,
      IdDias,
      PantallaCerroOK,
      ImprimeComodines,
      YaSeImprimio,
      Vencimiento1,
      Vencimiento2,
      PuertoO,
      PuertoD,
      PER,
      PesoB,
      PesoN,
      Paq,
      Consignee,
      Medidas,
      NroCaja,
      Pagada,
      Asiento,
      Contabiliza,
      DescuentoPorc,
      DescuentoMonto,
      IdEstado,
      CodigoPerfil,
      EliminaCantporDescarga,
      OCompra,
      PresupuestoConIVA,
      MontoComprobante,
      ImpNeto,
      ImpExento,
      ImpNoGravado,
      ImpIVA,
      ImpTributos,
      Subtotal2,
      ImpRNI,
      NroInternoViejo,
      IdServicioTecnico,
      CAE,
      DescuMoP,
      RecargoMoP
    } = req.body;

    if (!Empresa) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Obtener el último NroInterno y generar uno nuevo
    const lastNroInterno = await getLastNroInterno();
    const newNroInterno = lastNroInterno + 1;

    const newBuget = {
      Empresa,
      Sucursal,
      Tipo,
      Letra,
      Boca,
      Numero,
      Fecha: currentDate,
      DescuentoTotal,
      IdCliente,
      IdVendedor,
      VendedorComision,
      Obs,
      Condicion,
      Anulada,
      Alta: currentDate,
      Remito,
      Iva_Tipo,
      IdLista,
      Factura,
      FechaMOD: currentDate,
      UserMOD,
      FechaALTA: currentDate,
      UserALTA,
      FechaBAJA: currentDate,
      UserBAJA,
      AfectaStock,
      NombreCondVenta,
      Anterior,
      Siguiente,
      Moneda,
      MonedaCotizacion,
      EnMostrador,
      InteresIVA,
      InteresMonto,
      InteresPorcentaje,
      IdFinanciacion,
      FechaPrimeraCuota,
      IdCategoria,
      IdSubCategoria,
      RecargoTotal,
      RecargoPorc,
      RecargoMonto,
      IdDias,
      PantallaCerroOK,
      FechaIVA: currentDate,
      ImprimeComodines,
      YaSeImprimio,
      Vencimiento1,
      Vencimiento2,
      PuertoO,
      PuertoD,
      PER,
      PesoB,
      PesoN,
      Paq,
      Consignee,
      Medidas,
      NroCaja,
      Pagada,
      Asiento,
      Contabiliza,
      DescuentoPorc,
      DescuentoMonto,
      IdEstado,
      CodigoPerfil,
      EliminaCantporDescarga,
      OCompra,
      PresupuestoConIVA,
      MontoComprobante,
      ImpNeto,
      ImpExento,
      ImpNoGravado,
      ImpIVA,
      ImpTributos,
      Subtotal2,
      ImpRNI,
      NroInternoViejo,
      IdServicioTecnico,
      CAE,
      DescuMoP,
      RecargoMoP,
      NroInterno: newNroInterno
    };

    const connection = await getConnection();
    const result = await connection.query("INSERT INTO presupuestos SET ?", newBuget);

    res.json({ message: "Presupuesto agregado con éxito", NroInterno: newNroInterno });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// añadir artículos al presupuesto
const addBugetItems = async (req, res) => {
  try {
    console.log("Datos del artículo recibidos:", req.body);

    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: "El cuerpo de la solicitud debe ser un array no vacío de artículos." });
    }

    for (const item of req.body) {
      const {
        NroInterno,
        IdProducto,
      } = item;

      if (!IdProducto) {
        return res.status(400).json({ message: "Faltan datos obligatorios en uno o más artículos." });
      }
    }

    const connection = await getConnection();
    for (const item of req.body) {
      await connection.query("INSERT INTO presupuestos_articulos SET ?", item);
    }

    res.json({ message: "Artículos de presupuesto agregados con éxito" });

  } catch (err) {
    console.error('Error en addBugetItems:', err.message);
    res.status(500).json({ message: 'Error en el servidor.', error: err.message });
  }
};


export {
  addBuget,
  addBugetItems
};
