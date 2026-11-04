import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../../../app';

const lucia = {
  name: 'Lucía Mendoza',
  email: 'lucia.mendoza@correo.com',
  membershipType: 'estudiante',
};

describe('Members HTTP routes', () => {
  it('POST /members responds 201 with the created member and its id', async () => {
    const response = await request(createApp()).post('/members').send(lucia);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 1, ...lucia, active: true });
  });

  it('POST /members responds 400 with the message of the broken rule', async () => {
    const response = await request(createApp()).post('/members').send({ ...lucia, email: 'lucia.correo.com' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'El correo no tiene un formato válido' });
  });

  it('GET /members responds 200 with the list', async () => {
    const app = createApp();
    expect((await request(app).get('/members')).body).toEqual([]);
    await request(app).post('/members').send(lucia);
    const response = await request(app).get('/members');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, ...lucia, active: true }]);
  });

  it('GET /members/:id responds 200 with the member', async () => {
    const app = createApp();
    await request(app).post('/members').send(lucia);
    const response = await request(app).get('/members/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, ...lucia, active: true });
  });

  it('GET /members/:id responds 404 when the member does not exist', async () => {
    for (const id of ['999', 'abc']) {
      const response = await request(createApp()).get(`/members/${id}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Socio no encontrado' });
    }
  });

  it('PATCH /members/:id/deactivate responds 200 with the inactive member', async () => {
    const app = createApp();
    await request(app).post('/members').send(lucia);
    const response = await request(app).patch('/members/1/deactivate');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, ...lucia, active: false });
  });

  it('PATCH /members/:id/deactivate responds 404 when the member does not exist', async () => {
    const response = await request(createApp()).patch('/members/999/deactivate');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Socio no encontrado' });
  });
});
