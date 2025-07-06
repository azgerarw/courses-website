import { body } from 'express-validator';
export const validarFeedback = [
    body('voto').notEmpty().withMessage('El voto es obligatorio'),
    body('descripcion').trim().notEmpty().withMessage('El mensaje es obligatorio'),
];
