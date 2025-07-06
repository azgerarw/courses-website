import { body } from 'express-validator';

export const validarInscripciones = [
    body('curso_id').notEmpty().withMessage('El curso es obligatorio'),
    body('fecha').notEmpty().withMessage('La fecha es obligatoria'),
    body('tipo').notEmpty().withMessage('El tipo de curso es obligatorio'),
  ];