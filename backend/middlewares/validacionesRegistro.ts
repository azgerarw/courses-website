import { body } from 'express-validator';

export const validarRegistro = [
  body('usuario')
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .bail()
    .isLength({ min: 6 }).withMessage('El usuario debe tener al menos 6 caracteres'),
  
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .bail()
    .isEmail().withMessage('Debe ser un email válido'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .bail()
    .matches(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)
    .withMessage('La contraseña debe tener al menos 8 caracteres, una letra y un número'),
];