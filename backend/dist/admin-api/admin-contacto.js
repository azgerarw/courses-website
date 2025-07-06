import express from 'express';
import dbPromise from '../db/database.js';
import logger from '../middlewares/logger.js';
const router = express.Router();
router.use((req, res, next) => {
    console.log(`[API admin-contacto] ${req.method} ${req.originalUrl}`);
    next();
});
router.post('/', async (req, res) => {
    const db = await dbPromise;
    try {
        const result = await db.run('INSERT INTO contacto (nombre, email, mensaje) VALUES(?,?,?)', [req.body.nombre, req.body.email, req.body.mensaje]);
        return res.json({ data: {
                id: result.lastID,
                nombre: req.body.nombre,
                email: req.body.email,
                mensaje: req.body.mensaje
            } });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: `${err}` });
    }
});
router.get('/', async (req, res) => {
    const db = await dbPromise;
    try {
        const contactos = await db.all('SELECT * FROM contacto');
        return res.status(200).json(contactos);
    }
    catch (e) {
        console.error(e);
        return res.status(404).json({ error: 'no se ha encontrado ningún recurso' });
    }
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const db = await dbPromise;
    try {
        const result = await db.get('SELECT * FROM contacto WHERE id = ? ', [id]);
        return res.status(201).json({ data: {
                id: id,
                nombre: result.nombre,
                email: result.email,
                mensaje: result.mensaje
            } });
    }
    catch (e) {
        return res.status(404);
    }
});
router.delete('/:id', async (req, res) => {
    const db = await dbPromise;
    const { id } = req.params;
    try {
        await db.run('DELETE FROM contacto WHERE id = ?', [id]);
        logger.info(`El recurso con id: ${id} de la tabla contactos ha sido eliminado por el administrador`);
        return res.status(200).json({ data: { id } });
    }
    catch (e) {
        logger.error(`${e}`);
        console.log(e);
        return res.status(404);
    }
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email, mensaje } = req.body;
    const db = await dbPromise;
    try {
        await db.run('UPDATE contacto SET nombre = ?, email = ?, mensaje = ? WHERE id = ?', [nombre, email, mensaje, id]);
        const result = await db.get('SELECT * FROM contacto WHERE id = ? ', [id]);
        return res.status(201).json({ data: {
                id: id,
                nombre: result.nombre,
                email: result.email,
                mensaje: result.mensaje
            } });
    }
    catch (e) {
        return res.status(404);
    }
});
export default router;
