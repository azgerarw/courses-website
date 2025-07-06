import express from 'express';
import transporter from '../middlewares/nodemailer.js';
import dbPromise from '../db/database.js';
import logger from '../middlewares/logger.js';
import dotenv from 'dotenv';
import { validarContacto } from '../middlewares/validarContacto.js';
import { validationResult } from 'express-validator';
dotenv.config();
const router = express.Router();
router.post('/', validarContacto, async (req, res) => {
    const db = await dbPromise;
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        const erroresFormateados = {};
        errores.array().forEach(error => {
            const campo = 'path' in error ? error.path : ('param' in error ? error.param : 'desconocido');
            erroresFormateados[`${campo}`] = error.msg;
            const errores = [];
            errores.push(error.msg);
        });
        res.status(400).json({ ok: false, error: errores });
        return;
    }
    try {
        const result = await db.run('INSERT INTO contacto (nombre, email, mensaje) VALUES(?,?,?)', [req.body.nombre, req.body.email, req.body.mensaje]);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: `${req.body.email}`,
            subject: `Gracias por contactarnos`,
            text: 'Contenido del correo en texto plano',
            html: `
        <h1>Hemos recibido tu mensaje, <strong>${req.body.nombre}</strong> </h1>
        <p>El equipo de atención al cliente se pondrá en contacto contigo lo más pronto posible</p>
        <p>Puedes ver todos nuestros cursos <a href='http://localhost:5173/Cursos'>aquí</a><p>
        `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Correo enviado: ' + info.response);
        });
        logger.info(`${req.body.nombre} ha envíado un mensaje de contacto al servidor`);
        return res.json({ data: {
                id: result.lastID,
                nombre: req.body.nombre,
                email: req.body.email,
                mensaje: req.body.mensaje
            }, message: 'formulario enviado correctamente' });
    }
    catch (err) {
        logger.error(`${err}`);
        console.log(err);
        return res.status(400).json({ error: `${err}` });
    }
});
export default router;
