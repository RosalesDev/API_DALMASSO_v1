import { getConnection } from "../database/database";


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
        NroInterno,
        IdServicioTecnico,
        CAE,
        DescuMoP,
        RecargoMoP
      } = req.body;
  
      //validar datos que sean necesarios... creo...
      if (!Empresa || !Letra || !IdLista || !Moneda || !MonedaCotizacion || !IdEstado || !CodigoPerfil) {
        return res.status(400).json({ message: "Faltan datos obligatorios." });
      }
  
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
      const Buget = {
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
        NroInterno,
        IdServicioTecnico,
        CAE,
        DescuMoP,
        RecargoMoP
      };
  
      const connection = await getConnection();
      await connection.query("INSERT INTO presupuestos SET ?", Buget);
  
      res.json({ message: "Budget successfully added" });
  
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  };
  

  const addBugetItems = async (req, res) => {
    try {
      const {
        NroInterno,
        Unidad,
        IdProducto,
        IdCombinacion,
        Cantidad,
        Detalle,
        Cuenta_IVA,
        Alic_IVA,
        GNE,
        Descuento,
        ID, // incremental
        Unidad_1,
        Entregado,
        Bultos,
        RemitoOrigen,
        Peso,
        Despacho,
        Importe,
        Precio,
        DescuentoTexto,
        Comision,
        CalculaSobreBulto,
        ID_Presupuestos,
        Formula,
        Comentario
      } = req.body;
  
      // Validar campos obligatorios tengo que ver cuales son los que hay que validar aun.
      if (!NroInterno || !IdProducto || !Cantidad || !Detalle || !Importe || !Precio || !ID_Presupuestos) {
        return res.status(400).json({ message: "Faltan datos obligatorios." });
      }
  
      const BugetItems = {
        NroInterno,
        Unidad,
        IdProducto,
        IdCombinacion,
        Cantidad,
        Detalle,
        Cuenta_IVA,
        Alic_IVA,
        GNE,
        Descuento,
        Unidad_1,
        Entregado,
        Bultos,
        RemitoOrigen,
        Peso,
        Despacho,
        Importe,
        Precio,
        DescuentoTexto,
        Comision,
        CalculaSobreBulto,
        ID_Presupuestos,
        Formula,
        Comentario
      };
  
      const connection = await getConnection();
      await connection.query("INSERT INTO presupuestos_articulos SET ?", BugetItems);
  
      res.json({ message: "Buget item successfully added" });
  
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  };
  



export {
    addBuget,
    addBugetItems
}