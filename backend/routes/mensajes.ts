import express from 'express';
import dbPromise from '../db/database.js';
import { Request, Response } from 'express';


const router = express.Router();

type Mensaje = {
  remitente_id: number;
  destinatario_id: number;
  contenido: string;
  fecha: Date;
  leido: 0 | 1;
} 

// Obtener mensajes entre dos usuarios
router.get('/conversacion/:user1/:user2', async (req: Request<{user1: number; user2: number;}, {}, {}>, res: Response<Mensaje[] | { error: string; }>): Promise<any> => {
  const db = await dbPromise;
  

  try {
    const mensajes = await db.all(`
      SELECT * FROM mensajes
      WHERE (remitente_id = ? AND destinatario_id = ?)
         OR (remitente_id = ? AND destinatario_id = ?)
      ORDER BY fecha ASC
    `, [req.params.user1, req.params.user2, req.params.user2, req.params.user1]);

    return res.json(mensajes);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

router.get('/no-leidos/:usuario', async (req: Request<{ usuario: number;}, {}, {}>, res: Response<Mensaje[]>): Promise<any> => {

  const db = await dbPromise;

  try {
  const noLeidos = await db.all('SELECT * FROM mensajes WHERE destinatario_id = ? AND leido = 0', [req.params.usuario]);
  
  return res.json(noLeidos)
  } catch (err) {
    console.log(err);
  }

});

// Enviar mensaje
router.post('/enviar', async (req: Request<{}, {}, { remitente_id: number, destinatario_id: number, contenido: string; }>, res: Response< { mensaje: string; } | { error: string; } > ): Promise<any> => {
  const db = await dbPromise;
  

  if (!req.body.remitente_id || !req.body.destinatario_id || !req.body.contenido) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    await db.run(`
      INSERT INTO mensajes (remitente_id, destinatario_id, contenido)
      VALUES (?, ?, ?)
    `, [req.body.remitente_id, req.body.destinatario_id, req.body.contenido]);

    return res.status(201).json({ mensaje: 'Mensaje enviado' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

router.post('/marcar-leido', async (req: Request<{}, {}, { remitente_id: number; destinatario_id: number; }>, res: Response) => {

  const db = await dbPromise;
  
  try {
  await db.run(`
  UPDATE mensajes
  SET leido = 1
  WHERE remitente_id = ? AND destinatario_id = ? AND leido = 0
`, [req.body.remitente_id, req.body.destinatario_id]);
    } catch (err) {
      console.log(err);
    }
})

export default router;