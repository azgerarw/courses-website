import express, { Request, Response } from 'express';

import dbPromise from '../db/database.js';

const router = express.Router();

type Queries = {
  offset: string;
  limit: string;
}

type Usuario = {
  usuario_id: number;
  usuario: string;
  email: string;
  password: string;
}

type ErrorResponse = {
  status: 500 | 400;
  error: string;
}

type APIResponse = Usuario[] | ErrorResponse;

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */

router.get('/', async (req: Request<{}, {}, {}, Queries>, res: Response<APIResponse>): Promise<any> =>  {

  const query = req.query as { offset: string; limit: string };

  const db = await dbPromise;
  const offset = parseInt(query.offset);
  const limit = parseInt(query.limit);

  try { 
    const usuarios = await db.all('SELECT * FROM usuarios LIMIT ? OFFSET ?', [limit, offset]);
    return res.status(200).json(usuarios);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    return res.status(500).json({ status: 500, error: 'Error al obtener usuarios' });
  }
    
});

export default router;