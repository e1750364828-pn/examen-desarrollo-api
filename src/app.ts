import express, { Express } from 'express';
import { errorHandler } from './shared/errorHandler';

export const createApp = (): Express => {
  const app = express();
  app.use(express.json());

  app.use(errorHandler);
  return app;
};
