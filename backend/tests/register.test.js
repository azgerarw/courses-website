import request from 'supertest';
import app from '../server.js'; // Asegúrate que exportas `app` en server.js
import { describe, it, expect } from 'vitest'

describe('Auth endpoints', () => {
  it('Debería rechazar login sin datos', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({}); // cuerpo vacío

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('usuario');
    expect(res.body.errors.usuario).toBe('El nombre de usuario es obligatorio');
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.errors.email).toBe('El email es obligatorio');
    expect(res.body.errors).toHaveProperty('password');
    expect(res.body.errors.password).toBe('La contraseña es obligatoria');
  });

  it('Debería rechazar el registro si el correo no es formato email', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        usuario: 'usuario',
        email: 'email-gmail.com',
        password: 'hola1234'
      });

    expect(res.statusCode).toBe(400);
  });

  it('Debería rechazar el registro si la contraseña no incluye al menos 1 numero y 1 letra', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        usuario: 'usuario',
        email: 'email@gmail.com',
        password: 'holacomoestas'
      });

    expect(res.statusCode).toBe(400);
  });


  it('Debería rechazar el registro si el usuario es más corto de 6 caracteres', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        usuario: 'user',
        email: 'email@gmail.com',
        password: 'hola1234'
      });

    expect(res.statusCode).toBe(400);
  });

  it('Debería crear la cuenta', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        usuario: 'usuario5',
        email: 'email5@gmail.com',
        password: 'hola1234'
      });

    expect(res.statusCode).toBe(201);
  });

});
