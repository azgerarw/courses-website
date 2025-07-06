import request from 'supertest';
import app from '../server.js'; // Asegúrate que exportas `app` en server.js
import { describe, it, expect } from 'vitest'

describe('Auth endpoints', () => {
  it('Debería rechazar login sin datos', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({}); // cuerpo vacío

      
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('usuario');
    expect(res.body.errors.usuario).toBe('campo obligatorio');
    expect(res.body.errors).toHaveProperty('password');
    expect(res.body.errors.password).toBe('campo obligatorio');
  });

  it('Debería rechazar login con un campo vacío', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        usuario: 'usuario'
      }); 

      
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toHaveProperty('password');
    expect(res.body.errors.password).toBe('campo obligatorio');
  });

  it('Debería rechazar login con ambas credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        usuario: 'gerardo324',
        password: 'contrasenaInvalida'
      });

    expect(res.statusCode).toBe(401);
  });

  it('Debería rechazar login con password incorrecta', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        usuario: 'gerardo',
        password: 'contrasenaInvalida'
      });

    expect(res.statusCode).toBe(401);
  });

  it('Debería rechazar login con usuario incorrecta', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        usuario: 'gdsadsada',
        password: 'hola1234'
      });

    expect(res.statusCode).toBe(401);
  });

  it('Debería loguear el usuario exitosamente', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({        
        usuario: 'gerardo',
        password: 'hola1234'
      });

    expect(res.statusCode).toBe(200); // ✅ éxito esperado
    expect(res.body).toHaveProperty('token');
  });

});
