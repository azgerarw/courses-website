import express from 'express';
import dbPromise from '../db/database.js';
const router = express.Router();
router.get('/:id', async (req, res) => {
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
        return res.json(conversaciones);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'error al recuperar las conversaciones' });
    }
});
export default router;
