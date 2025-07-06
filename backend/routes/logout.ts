import express from 'express';
import logoutRoute from '../api/logout.js'; // o donde tengas la función

const router = express.Router();

router.post('/', logoutRoute);

export default router;