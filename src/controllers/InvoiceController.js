import { getInvoice } from "../services/invoiceService";

const InvoiceController = async (req, res) => {
  try {
    const invoiceData = await getInvoice.getInvoiceData(req);

    if (invoiceData.error) {
      return res.status(400).json({ success: false, error: invoiceData.error });
    }

    res.json({ success: true, data: invoiceData });
  } catch (err) {
    console.error("Error en el controlador:", err);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};

export const methods = {
  getInvoice: InvoiceController,
};
