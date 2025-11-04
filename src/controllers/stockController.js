import { getStockFisicoService } from "../services/stockService.js";

export const getStockFisico = async (req, res) => {
  try {
    const { IdProd, IEmp, ISuc } = req.params;
    const stock = await getStockFisicoService(IdProd, IEmp, ISuc);

    res.json({
      IdProd,
      IEmp,
      ISuc,
      stockFisico: stock
    });
  } catch (error) {
    console.error("Error en getStockFisico:", error);
    res.status(500).json({ error: "Error al calcular stock físico" });
  }
};
