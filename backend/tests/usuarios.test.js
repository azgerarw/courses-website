import request from 'supertest';
import app from '../server.js'; // Asegúrate que exportas `app` en server.js
import { describe, it, expect } from 'vitest'

it('Debería obtener 5 usuarios', async () => {
    const res = await request(app)
      .get('/api/usuarios?limit=5&offset=0');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(5);
    expect(res.body[0]).toHaveProperty('usuario_id');
    expect(res.body[0]).toHaveProperty('usuario');
    expect(res.body[0]).toHaveProperty('email');
    expect(typeof res.body[0].usuario_id).toBe('number');
    expect(typeof res.body[0].usuario).toBe('string');
    expect(typeof res.body[0].email).toBe('string');
    
  });

  it('Debería obtener 5 usuarios', async () => {
    const res = await request(app)
      .get('/api/usuarios');
    
    expect(res.statusCode).toBe(500);
    expect(res.body.length).toBe(undefined);
   
    
  });

  it('Debería obtener 2 usuarios', async () => {

    const res = await request(app).get('/api/usuarios?limit=2&offset=1');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(2);
    
  });

  it('Debería devolver un error', async () => {

    const res = await request(app).get('/api/usuarios?limit=notanumber');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');

  });