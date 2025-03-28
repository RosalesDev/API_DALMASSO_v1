import express from 'express';
import { methods as InvoiceController } from '../controllers/InvoiceController';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para obtener facturas por ID de cliente (requiere autenticación)
router.get('/by-client/:idCliente', authenticateToken, InvoiceController.getInvoicesByClientId);

// Nueva ruta para acceso público a facturas utilizando Numero y Cuit (sin autenticación)
router.get('/public/:Numero/:Cuit', InvoiceController.getInvoiceByPublicParams);

export default router;
