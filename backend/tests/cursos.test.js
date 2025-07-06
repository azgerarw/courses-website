import { it, expect } from 'vitest';
import request from 'supertest';
import app from '../server.js'; 

it('Debería devolver todos los cursos', async () => {
    const res = await request(app)
      .get('/api/cursos');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
    expect(res.body[0]).toHaveProperty('titulo');
    expect(res.body[0]).toHaveProperty('descripcion');
    expect(res.body[0]).toHaveProperty('categoria');
    expect(res.body[0]).toHaveProperty('id');
    expect(typeof res.body[0].titulo).toBe('string');
    expect(typeof res.body[0].descripcion).toBe('string');
    expect(typeof res.body[0].categoria).toBe('string');
    expect(typeof res.body[0].id).toBe('number');
    
});

it('Debería devolver todos los cursos', async () => {
    const res = await request(app)
      .get('/api/cursos/buscar?search=');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
    expect(res.body[0]).toHaveProperty('titulo');
    expect(res.body[0]).toHaveProperty('descripcion');
    expect(res.body[0]).toHaveProperty('categoria');
    expect(res.body[0]).toHaveProperty('id');
    expect(typeof res.body[0].titulo).toBe('string');
    expect(typeof res.body[0].descripcion).toBe('string');
    expect(typeof res.body[0].categoria).toBe('string');
    expect(typeof res.body[0].id).toBe('number');
    
});

it('Debería devolver el curso de html', async () => {
    const res = await request(app)
      .get('/api/cursos/buscar?search=html');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('titulo') == 'html';
    expect(res.body[0]).toHaveProperty('descripcion');
    expect(res.body[0]).toHaveProperty('categoria');
    expect(res.body[0]).toHaveProperty('id');
    expect(typeof res.body[0].titulo).toBe('string');
    expect(typeof res.body[0].descripcion).toBe('string');
    expect(typeof res.body[0].categoria).toBe('string');
    expect(typeof res.body[0].id).toBe('number');
    
});

it('Debería devolver todos los cursos que contienen la letra o letras incluidas en la búsqueda', async () => {
    const res = await request(app)
      .get('/api/cursos/buscar?search=h');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[2]).toHaveProperty('titulo') == 'php';
    expect(res.body[0]).toHaveProperty('descripcion');
    expect(res.body[0]).toHaveProperty('categoria');
    expect(res.body[0]).toHaveProperty('id');
    expect(typeof res.body[0].titulo).toBe('string');
    expect(typeof res.body[0].descripcion).toBe('string');
    expect(typeof res.body[0].categoria).toBe('string');
    expect(typeof res.body[0].id).toBe('number');
    
});

it('Debería devolver todos los cursos', async () => {
    const res = await request(app)
      .get('/api/cursos/all');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('titulo');
    expect(res.body[0]).toHaveProperty('descripcion');
    expect(res.body[0]).toHaveProperty('categoria');
    expect(res.body[0]).toHaveProperty('id');
    expect(typeof res.body[0].titulo).toBe('string');
    expect(typeof res.body[0].descripcion).toBe('string');
    expect(typeof res.body[0].categoria).toBe('string');
    expect(typeof res.body[0].id).toBe('number');
    
});

it('Debería devolver todos los cursos de frontend', async () => {
    const res = await request(app)
      .get('/api/cursos/frontend');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(8);
    expect(res.body[0]).toHaveProperty('titulo');
    expect(res.body[0]).toHaveProperty('descripcion');
    expect(res.body[0]).toHaveProperty('categoria');
    expect(res.body[0]).toHaveProperty('id');
    expect(typeof res.body[0].titulo).toBe('string');
    expect(typeof res.body[0].descripcion).toBe('string');
    expect(typeof res.body[0].categoria).toBe('string');
    expect(typeof res.body[0].id).toBe('number');
    
});

it('Debería devolver todos los cursos de backend', async () => {
    const res = await request(app)
      .get('/api/cursos/backend');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(6);
    expect(res.body[0]).toHaveProperty('titulo');
    expect(res.body[0]).toHaveProperty('descripcion');
    expect(res.body[0]).toHaveProperty('categoria');
    expect(res.body[0]).toHaveProperty('id');
    expect(typeof res.body[0].titulo).toBe('string');
    expect(typeof res.body[0].descripcion).toBe('string');
    expect(typeof res.body[0].categoria).toBe('string');
    expect(typeof res.body[0].id).toBe('number');
    
});