import { getInvoice } from "../services/invoiceService";

const getInvoicesByClientIdController = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const invoices = await getInvoice.getInvoicesByClientId(idCliente);

    if (invoices.error) {
      return res.status(400).json({ success: false, error: invoices.error });
    }

    res.json({ success: true, data: invoices });
  } catch (err) {
    console.error("Error en el controlador:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

export const methods = {
  getInvoicesByClientId: getInvoicesByClientIdController,
};
