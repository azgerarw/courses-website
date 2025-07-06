// backend/api/login.js
import passport from 'passport';
import jwt from 'jsonwebtoken';
import logger from '../middlewares/logger.js';
import dotenv from 'dotenv';
dotenv.config();
export default function loginRoute(req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            logger.error(`Login incorrecto para usuario: ${user.usuario}`);
            return res.status(401).json({ message: info?.message || 'Login fallido' });
        }
        const payload = { id: user.usuario_id, usuario: user.usuario };
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está definido en el archivo .env');
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        logger.info(`Login correcto para usuario: ${user.usuario} desde IP ${req.ip}`);
        return res.json({ message: 'Login correcto', token });
    })(req, res, next);
}
