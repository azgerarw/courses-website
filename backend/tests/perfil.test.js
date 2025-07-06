import request from 'supertest';
import app from '../server.js'; // Asegúrate que exportas `app` en server.js
import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import dbPromise from '../db/database.js';

let token;


describe('Rutas de perfil', () => {
  beforeAll(async () => {
    const db = await dbPromise;

    

    // Crear usuario
    const res1 = await request(app)
      .post('/api/register')
      .send({
        usuario: 'usuario',
        email: 'usuario@gmail.com',
        password: 'hola1234'
      });

    // Loguear y guardar token
    const res = await request(app)
      .post('/api/login')
      .send({ usuario: 'usuario', password: 'hola1234' }); // Que coincida con tu login real

    token = res.body.token;
    });

  afterAll(async () => {
    const db = await dbPromise;
    await db.run('DELETE FROM usuarios WHERE usuario = ?', ['usuario']);
  });

  it('Debería obtener el perfil del usuario', async () => {
    const res = await request(app)
      .get('/api/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body).toHaveProperty('inscripciones');
  });

  it('Debería actualizar el email del usuario', async () => {
    const res = await request(app)
      .put('/api/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'nuevo4@test.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Correo actualizado');
    expect(res.body).toHaveProperty('email', 'nuevo4@test.com');
  });

  it('Debería eliminar la cuenta del usuario', async () => {
    const res = await request(app)
      .delete('/api/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Cuenta eliminada correctamente');
  });
});
