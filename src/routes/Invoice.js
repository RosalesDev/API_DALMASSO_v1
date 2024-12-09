import express from 'express';
import { methods as InvoiceController } from '../controllers/InvoiceController';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para obtener facturas por ID de cliente
router.get('/by-client/:idCliente', authenticateToken, InvoiceController.getInvoicesByClientId);

export default router;
