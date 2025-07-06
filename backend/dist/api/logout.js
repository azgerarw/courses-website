import jwt from 'jsonwebtoken';
import logger from '../middlewares/logger.js';
import dotenv from 'dotenv';
dotenv.config();
export default function logoutRoute(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está definido en el archivo .env');
    }
    if (token) {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        logger.info(`Logout de usuario: ${payload.usuario} (ID: ${payload.id})`);
    }
    else {
        logger.warn('Logout con token inválido o expirado');
    }
    return res.json({ message: 'Logout registrado' }); // No se retorna nada
}
;
