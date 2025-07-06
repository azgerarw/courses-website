import express from 'express';
import passport from 'passport';
import dbPromise from '../db/database.js';
import logger from '../middlewares/logger.js';
import { validarFeedback } from '../middlewares/validarFeedback.js';
import { validationResult } from 'express-validator';
import { log } from 'console';
const router = express.Router();
const db = await dbPromise;
/**
 * @swagger
 * /api/feedback:
 *   get:
 *     summary: Obtiene todas las reseñas
 *     tags:
 *       - feedback
 *     responses:
 *       200:
 *         description: Lista de reseñas
 */
router.get('/', async (req, res) => {
    try {
        const feedback = await db.all('SELECT * FROM feedback');
        return res.json(feedback);
    }
    catch (err) {
        console.log(err);
        return res.json({ error: 'Ha ocurrido un error durante la búsqueda de las reseñas' });
    }
});
/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Crea una reseña
 *     tags:
 *       - feedback
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - voto
 *             properties:
 *               descripcion:
 *                 type: string
 *               voto:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', passport.authenticate('jwt', { session: false }), validarFeedback, async (req, res) => {
    const user = req.user;
    const errores = validationResult(req);
    log(errores);
    if (!errores.isEmpty()) {
        const erroresFormateados = {};
        errores.array().forEach(error => {
            const campo = 'path' in error ? error.path : ('param' in error ? error.param : 'desconocido');
            erroresFormateados[`${campo}`] = error.msg;
            const errores = [];
            errores.push(error.msg);
        });
        res.status(400).json({ ok: false, error: errores });
        return;
    }
    if (req.user) {
        try {
            await db.run('INSERT INTO feedback (usuario_id, voto, descripcion, autor) VALUES (?,?,?,?)', [user.usuario_id, parseInt(req.body.voto), req.body.descripcion, user.usuario]);
            logger.info(`${user.usuario} ha añadido una reseña`);
            return res.json({ ok: true, message: 'Se ha publicado la reseña' });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ error: 'Ha ocurrido un error al publicar la reseña' });
        }
    }
});
export default router;
