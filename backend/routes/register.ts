import express from 'express';
import registerUser from '../api/registerUser.js';
import { validarRegistro } from '../middlewares/validacionesRegistro.js';
import { validationResult } from 'express-validator';
import upload from '../middlewares/upload.js'; // o donde lo tengas
import { Request, Response } from 'express';

const router = express.Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registra un usuario
 *     tags:
 *       - registro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - email
 *               - password
 *             properties:
 *               usuario:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reseña creada exitosamente
 *       400:
 *         description: Datos inválidos
 */

router.post('/', upload.single('imagen'), validarRegistro, async (req: Request, res: Response): Promise<any> => {
    
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const erroresFormateados: Record<string, string> = {};
    errores.array().forEach(error => {
      const campo = 'path' in error ? error.path : ('param' in error ? error.param : 'desconocido');
      erroresFormateados[`${campo}`] = error.msg;
    });
    
    
    return res.status(400).json({ ok: false, errors: erroresFormateados });
  }

  await registerUser(req, res);
});

export default router;
