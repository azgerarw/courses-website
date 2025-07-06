import express, { Request, Response } from 'express';
import dbPromise from '../db/database.js';
const router = express.Router();

type Conversacion = {
  remitente_id: number;
  destinatario_id: number;
  contenido: string;
  fecha: Date;
  leido: 0 | 1;
  usuario_id: number;
  imagen: string;
  no_leidos: 0 | 1;
}

router.get('/:id', async (req: Request<{ id: number }, {}, {}>, res: Response<Conversacion[] | { error: string; }>): Promise<any> => {

    const db = await dbPromise;
    

    try {
        const conversaciones = await db.all(`
    SELECT 
  m.*,
  usuario_id AS usuario_id,
  usuario AS usuario,
  imagen AS imagen,
  (
    SELECT COUNT(*) 
    FROM mensajes 
    WHERE remitente_id = usuario_id AND destinatario_id = ? AND leido = 0
  ) AS no_leidos
FROM mensajes m
INNER JOIN (
  SELECT 
    CASE
      WHEN remitente_id = ? THEN destinatario_id
      ELSE remitente_id
    END AS interlocutor_id,
    MAX(id) AS max_id
  FROM mensajes
  WHERE remitente_id = ? OR destinatario_id = ?
  GROUP BY interlocutor_id
) sub ON m.id = sub.max_id
JOIN usuarios u ON usuario_id = sub.interlocutor_id
ORDER BY m.id DESC;

    `, [req.params.id, req.params.id, req.params.id]);
            
        return res.json(conversaciones)
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: 'error al recuperar las conversaciones' })
    }

});

export default router;