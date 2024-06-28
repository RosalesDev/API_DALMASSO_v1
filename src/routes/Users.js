import express from 'express';
import { methods as userService } from '../services/userService';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

router.get('/users', authenticateToken, userService.getUserList);
router.get('/users/:userId', authenticateToken, userService.getUserById);
router.get('/user', authenticateToken, userService.getLoggedUser);

// Ruta para obtener el usuario actual no estaria funcionando. T.T
router.get('/current-user', authenticateToken, async (req, res) => {
    console.log("esto es req", req);
    try {
        const userId = req.user.id;
        console.log("Authenticated user ID:", userId); 
        const currentUser = await userService.getCurrentUser(userId); 
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
