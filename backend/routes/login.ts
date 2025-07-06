import express from 'express';
import loginRoute from '../api/login.js'; // o donde tengas la función
import { validarLogin } from '../middlewares/validacionesLogin.js';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token JWT
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - password
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: gerardo
 *               password:
 *                 type: string
 *                 example: hola1234
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */


router.post('/', validarLogin, (req: Request, res: Response, next: NextFunction) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const erroresFormateados: Record<string, string> = {};
    errores.array().forEach(error => {
      const campo = 'path' in error ? error.path : ('param' in error ? error.param : 'desconocido');
      erroresFormateados[`${campo}`] = error.msg;
    });

    res.status(400).json({ ok: false, errors: erroresFormateados });

    return; 
  }

  loginRoute(req, res, next); 
});


export default router;