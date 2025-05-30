import { getInvoice } from "../services/invoiceService";

const getInvoicesByClientId = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const invoices = await getInvoice.getInvoicesByClientId(idCliente);

    if (!invoices) {
      return res.status(404).json({ success: false, error: "No se encontraron facturas" });
    }

    res.json({ success: true, data: invoices });
  } catch (err) {
    console.error("Error en el controlador:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

// Acceso público
const getInvoiceByPublicParams = async (req, res) => {
  try {
    const { Numero, Cuit } = req.params;

    if (!Numero || !Cuit) {
      return res.status(400).json({ success: false, error: 'Parámetros Numero y Cuit son requeridos' });
    }

    const invoices = await getInvoice.getInvoiceByPublicParams(Numero, Cuit);

    if (invoices.error) {
      return res.status(400).json({ success: false, error: invoices.error });
    }

    res.json({ success: true, data: invoices });
  } catch (err) {
    console.error("Error en el controlador público:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

export const methods = {
  getInvoicesByClientId,
  getInvoiceByPublicParams,
};
