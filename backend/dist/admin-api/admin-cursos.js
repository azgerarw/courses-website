import express from 'express';
import dbPromise from '../db/database.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const cursos = await db.all('SELECT * FROM cursos');
        return res.status(200).json(cursos);
    }
    catch (err) {
        console.error('Error al obtener cursos:', err);
        return res.status(500).json({ error: 'Error al obtener cursos' });
    }
});
export default router;
