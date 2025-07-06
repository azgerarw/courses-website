import { body } from 'express-validator';
export const validarContacto = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('mensaje').notEmpty().withMessage('El mensaje es obligatorio'),
];
