import express, { Request, Response } from 'express';
import passport from 'passport';
import dbPromise from '../db/database.js';
import logger from '../middlewares/logger.js';
import { validationResult } from 'express-validator';
import { validarInscripciones } from '../middlewares/validarInscripciones.js';
import transporter from '../middlewares/nodemailer.js';


const router = express.Router();
const db = await dbPromise;

type ResponseType = 
    { error: string } 
    | { ok: boolean; error: {}; }
    | { ok: boolean; message: string; }


router.post('/', passport.authenticate('jwt', { session: false }), validarInscripciones, async (req: Request, res: Response<ResponseType>): Promise<any> => {
    const { curso_id, fecha, tipo } = req.body;
    
    const errores = validationResult(req);
      if (!errores.isEmpty()) {
        const erroresFormateados: Record<string, string> = {};
        errores.array().forEach(error => {
          const campo = 'path' in error ? error.path : ('param' in error ? error.param : 'desconocido');
          erroresFormateados[`${campo}`] = error.msg;
          const errores = []
          errores.push(error.msg)
        });
        
        return res.status(400).json({ ok: false, error: errores });
    
         
      }
    
    const user = req.user as { usuario_id: number; usuario: string; email: string };

    const curso = await db.all('SELECT * FROM cursos WHERE id = ?', [curso_id]);
    
    const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${user.email}`,
    subject: `Inscripción curso ${curso[0].titulo}`,
    text: 'Contenido del correo en texto plano',
    html: `
    <h1>Te has inscrito al curso de ${curso[0].titulo}</h1>
    <h3>Detalles del curso: </h3>
    <p>Número del curso: ${curso[0].id}</p>
    <p>Tipo: ${tipo}</p>
    <p>Categoría: ${curso[0].categoria}</p>
    <p>Inicia en: ${fecha}</p>
    <p>Descripcion: </p>
    <p>${curso[0].descripcion}</p>
    `
    };

    
    const usuario_id = user.usuario_id;
    try {
    await db.run('INSERT INTO inscripciones (usuario_id, curso_id, fecha, tipo) VALUES (?,?,?,?)', [usuario_id, parseInt(curso_id), fecha, tipo])
    logger.info(`${user.usuario} se ha inscrito al curso # ${curso_id}`)
    
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Correo enviado: ' + info.response);
    });

    return res.json({ ok: true, message: 'Inscripción registrada correctamente' });
    } catch (err) {
        
    console.log(err)
    return res.status(400).json( { error: 'Ha ocurrido un error al procesar la inscripción, posiblemente haya olvidado iniciar sesión.' } )
    }
})

export default router;