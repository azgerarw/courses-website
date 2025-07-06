import { body } from 'express-validator';

export const validarLogin = [
  body('usuario').notEmpty().withMessage('campo obligatorio'),

  body('password').notEmpty().withMessage('campo obligatorio')
];