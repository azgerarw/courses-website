import express from 'express';
import passport from 'passport';
import dbPromise from '../db/database.js';
import upload from '../middlewares/upload.js'; 
import logger from '../middlewares/logger.js';
import { Request, Response } from 'express';

const router = express.Router();

type Inscripcion = {
  usuario_id: number;
  curso_id: number;
  fecha: string;
  tipo: string;
}

type User = {
    usuario_id: number;
    usuario: string;
    email: string;
    imagen: string;
    verificado: number;
    inscripciones?: Inscripcion[];
  }

router.get('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response<User>): Promise<any> => {
    
  const user: User = req.user as User;
  try {
    const db = await dbPromise;
    const inscripciones = await db.all('SELECT * FROM inscripciones WHERE usuario_id = ?', [user.usuario_id]);
    
    
    return res.json({
    usuario_id: user.usuario_id,
    usuario: user.usuario,
    email: user.email,
    imagen: user.imagen,
    verificado: user.verificado,
    inscripciones: inscripciones
  });
   
  } catch (err) {
    console.log(err)
  }
 

  

});

router.delete(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response<{ error: string; } | { message: string; }>): Promise<any> => {

      const user: User = req.user as User;

      try {
        const db = await dbPromise;
        await db.run('DELETE FROM usuarios WHERE usuario_id = ?', [user.usuario_id]);
        logger.info(`${user.usuario} acaba de eliminar su cuenta`)
        return res.json({ message: 'Cuenta eliminada correctamente' });
      } catch (err) {
        return res.status(500).json({ error: 'Error al eliminar cuenta' });
      }
    }
  );



router.put('/', passport.authenticate('jwt', { session: false }), upload.single('imagen'), async (req: Request<{}, {}, { email?: string; }>, res: Response< { error: string; } | { message: string; imagen: string; } | { message: string; email: string; } >): Promise<any> => {
  const db = await dbPromise;

  const user: User = req.user as User;

  if (req.file) {
    const filename = req.file.filename;
    await db.run('UPDATE usuarios SET imagen = ? WHERE usuario_id = ?', [filename, user.usuario_id]);
    logger.info(`${user.usuario} ha actualizado su foto de perfil`)
    return res.json({ message: 'Foto actualizada', imagen: filename });
  }

  if (req.body.email) {
    
    
    const email = req.body.email;

    await db.run('UPDATE usuarios SET email = ? WHERE usuario_id = ?', [email, user.usuario_id]);
    logger.info(`${user.usuario} ha actualizado su correo electrónico`)
    return res.json({ message: 'Correo actualizado', email: email });
  }

  return res.status(400).json({ error: 'No se ha rellenado el campo' });
});

export default router;
