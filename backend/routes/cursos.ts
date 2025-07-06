import express, { Request, Response } from 'express';

import dbPromise from '../db/database.js';

const router = express.Router();

type Curso = {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
}

  /**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Obtiene todos los cursos
 *     tags:
 *       - cursos
 *     responses:
 *       200:
 *         description: Lista de cursos
 */

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

 /**
 * @swagger
 * /api/cursos/buscar:
 *   get:
 *     summary: Busca cursos por título
 *     tags:
 *       - cursos
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Término de búsqueda para filtrar cursos por título
 *     responses:
 *       200:
 *         description: Lista de cursos coincidentes
 */

router.get('/buscar', async (req: Request<{}, {}, {}, { search?: string }>, res: Response<Curso[] | { error: string }>): Promise<any> => {
  
  const db = await dbPromise;
  
  try {
    if(req.query.search == '') {
      const cursos = await db.all('SELECT * FROM cursos');
      return res.status(200).json(cursos); 
          
      
    } else {
      const cursos = await db.all('SELECT * FROM cursos WHERE titulo LIKE ?', [`%${req.query.search}%`]);
      
      return res.status(200).json(cursos); 
    }
    
  } catch (err) {
    console.error('Error al obtener cursos:', err);
    return res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

/**
 * @swagger
 * /api/cursos/{categoria}:
 *   get:
 *     summary: Obtiene todos los cursos por categoría
 *     tags:
 *       - cursos
 *     parameters:
 *       - in: path
 *         name: categoria
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la categoría (usar "all" para todos)
 *     responses:
 *       200:
 *         description: Lista de cursos por categoría
 */


router.get('/:categoria', async (req: Request<{ categoria: string }, {}, {}, {}>, res: Response<Curso[] | { error: string }>): Promise<any> => {
  
  const db = await dbPromise;

  try {
    if(req.params.categoria !== 'all') {
    
    const cursos = await db.all('SELECT * FROM cursos WHERE categoria = ?', [req.params.categoria]);
    return res.status(200).json(cursos);
    
    } else {
      
      const cursos = await db.all('SELECT * FROM cursos');
      return res.status(200).json(cursos);
    }
    
  } catch (err) {
    console.error('Error al obtener cursos:', err);
    return res.status(500).json({ error: 'Error al obtener cursos' });
  }
});



export default router;