import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { DomainError } from './DomainError';
import { errorHandler } from './errorHandler';
import { NotFoundError } from './NotFoundError';

const buildApp = (error: Error) => {
  const app = express();
  app.get('/', () => {
    throw error;
  });
  app.use(errorHandler);
  return app;
};

describe('errorHandler', () => {
  it('responds 400 with the message of a DomainError', async () => {
    const response = await request(buildApp(new DomainError('Dato inválido'))).get('/');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Dato inválido' });
  });

  it('responds 404 with the message of a NotFoundError', async () => {
    const response = await request(buildApp(new NotFoundError('No encontrado'))).get('/');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'No encontrado' });
  });

  it('responds 500 for unexpected errors', async () => {
    const response = await request(buildApp(new Error('fallo'))).get('/');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error interno del servidor' });
  });
});
