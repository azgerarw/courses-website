import express from 'express';
import dbPromise from '../db/database.js';
import logger from '../middlewares/logger.js';
const router = express.Router();
router.get('/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const db = await dbPromise;
        const usuario = await db.get(`SELECT * FROM usuarios WHERE token_verificacion = ?`, [token]);
        if (!usuario) {
            return res.status(404).json({ status: 404, error: 'Token inválido o expirado' });
        }
        if (usuario.verificado) {
            return res.status(400).json({ status: 400, error: 'Este usuario ya ha sido verificado.' });
        }
        await db.run(`UPDATE usuarios SET verificado = 1, token_verificacion = NULL WHERE usuario_id = ?`, [usuario.usuario_id]);
        logger.info(`${usuario.usuario} ha verificado su cuenta`);
        res.status(200).redirect('http://localhost:5173/Verificado');
    }
    catch (err) {
        console.error('Error al verificar usuario:', err);
        res.status(500).json({ status: 500, error: 'Error interno del servidor' });
    }
});
export default router;
