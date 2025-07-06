import express from 'express';
import dbPromise from '../db/database.js';
import transporter from '../middlewares/nodemailer.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import logger from '../middlewares/logger.js';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { validarRestablecimiento, validarSolicitud } from '../middlewares/validarCambioPassword.js';

const router = express.Router();

type CustomBody = {
  usuario?: string;
  email?: string;
  token?: string;
  nuevaContrasena?: string;
}

type SuccessResponse = {
  status: 200 | 201;
  body: { message: string;
  };
};

type ErrorResponse = {
  status: 400 | 404 ;
  body: { error: string | {} };
};

type APIResponse = SuccessResponse | ErrorResponse;

router.post('/', validarSolicitud, async (req: Request<{}, {}, CustomBody>, res: Response<APIResponse>): Promise<any> => {

    const errores = validationResult(req);
      if (!errores.isEmpty()) {
        const erroresFormateados: Record<string, string> = {};
        errores.array().forEach(error => {
          const campo = 'path' in error ? error.path : ('param' in error ? error.param : 'desconocido');
          erroresFormateados[`${campo}`] = error.msg;
          const errores = []
          errores.push(error.msg)
        });
        
        return res.status(400).json( { status: 400, body: { error: errores } } );
             
      }

    const db = await dbPromise;

    const usuario = await db.all('SELECT * FROM usuarios WHERE usuario = ? AND email = ?', [req.body.usuario, req.body.email])
    
    if (!usuario) return res.status(404).json({  status: 404, body: { error: 'Usuario no encontrado' }  });

    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = Date.now() + 3600000; // 1 hora

    
    const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${req.body.email}`,
    subject: `Restablecimiento de contraseña`,
    text: 'Contenido del correo en texto plano',
    html: `
    <h1>Para restablecer tu contraseña haz clic en el siguiente enlace</h1>
    <a href=http://localhost:5173/RestablecerPasswordLink/${token}>Restablecer contraseña</a>
    `
    };

    if (usuario[0]) {

        await db.run(
        'UPDATE usuarios SET token_restablecer = ?, token_expira = ? WHERE usuario_id = ?',
        [token, expiracion, usuario[0].usuario_id]
        );

        logger.info(`${usuario[0].usuario} ha mandado una petición para restablecer su contraseña`)
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Correo enviado: ' + info.response);
          });
    }

    return res.status(200).json({ status: 200, body: { message: 'Un correo de restablecimiento ha sido enviado a tu correo' }  })

});

router.get('/:token', async (req: Request, res: Response<APIResponse>): Promise<any> => {
  const db = await dbPromise;
  
  const usuario: { usuario_id: number } = await db.all(
    'SELECT * FROM usuarios WHERE token_restablecer = ? AND token_expira > ?',
    [req.params.token, Date.now()]
  );
  
  if (!usuario) {
    return res.status(404).json({ status: 404, body: { error: 'Token inválido o expirado' } });
  }

  return res.status(200).json({ status: 200, body: { message: 'Token reconocido' } });
});


router.put('/', validarRestablecimiento, async (req: Request<{}, {}, CustomBody>, res: Response<APIResponse>): Promise<any> => {
  
  const errores = validationResult(req);
      if (!errores.isEmpty()) {
        const erroresFormateados: Record<string, string> = {};
        errores.array().forEach(error => {
          const campo = 'path' in error ? error.path : ('param' in error ? error.param : 'desconocido');
          erroresFormateados[`${campo}`] = error.msg;
          const errores = []
          errores.push(error.msg)
        });
        
        return res.status(400).json( { status: 400, body: { error: errores } } );
             
      }
    
  const db = await dbPromise;
  const usuario = await db.all(
    'SELECT * FROM usuarios WHERE token_restablecer = ? AND token_expira > ?',
    [req.body.token, Date.now()]
  );
  
  if (!usuario) return res.status(400).json({ status: 400, body: { error: 'Token inválido o expirado' } });

  if (req.body.nuevaContrasena) {
    const hash = await bcrypt.hash(req.body.nuevaContrasena, 10);
    await db.run(
      'UPDATE usuarios SET password = ?, token_restablecer = NULL, token_expira = NULL WHERE usuario_id = ?',
      [hash, usuario[0].usuario_id]
    );
    logger.info(`${usuario[0].usuario} ha actualizado su contraseña`)
  }

  return res.status(201).json({ status: 201, body: { message: 'Contraseña actualizada' } });
});


export default router;