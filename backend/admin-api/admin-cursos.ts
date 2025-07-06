import express, { Request, Response } from 'express';

import dbPromise from '../db/database.js';

const router = express.Router();

type Curso = {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
}

router.get('/', async (req: Request, res: Response<Curso[] | { error: string } >): Promise<any> => {
  
  try {
    const db = await dbPromise;
    const cursos = await db.all('SELECT * FROM cursos');
    
    return res.status(200).json(cursos);

  } catch (err) {
    console.error('Error al obtener cursos:', err);
    return res.status(500).json({ error: 'Error al obtener cursos' });
  }
});



export default router;