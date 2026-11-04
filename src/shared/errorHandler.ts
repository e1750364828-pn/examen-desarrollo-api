import { NextFunction, Request, Response } from 'express';
import { DomainError } from './DomainError';
import { HTTP_STATUS } from './httpStatus';
import { NotFoundError } from './NotFoundError';

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof DomainError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    return;
  }
  if (error instanceof NotFoundError) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    return;
  }
  console.error(error);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor' });
};
