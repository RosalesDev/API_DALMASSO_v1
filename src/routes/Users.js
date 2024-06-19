import express from 'express';
import { methods as userService } from '../services/userService';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

// Rutas existentes
router.get('/users', userService.getUserList);
router.get('/users/:userId', userService.getUserById);
router.get('/user', userService.getLoggedUser);

// Ruta para obtener el usuario actual
router.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const currentUser = await userService.getCurrentUser(req.user.id); 
        if (!currentUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(currentUser);
    } catch (error) {
        console.error("Error al obtener información del usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;
