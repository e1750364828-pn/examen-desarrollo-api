import { Router } from 'express';
import { HTTP_STATUS } from '../../../../shared/httpStatus';
import { MemberService } from '../../application/MemberService';

export const createMemberRoutes = (service: MemberService): Router => {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.list());
  });

  router.get('/:id', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.getById(Number(req.params.id)));
  });

  router.post('/', async (req, res) => {
    res.status(HTTP_STATUS.CREATED).json(await service.create(req.body));
  });

  router.patch('/:id/deactivate', async (req, res) => {
    res.status(HTTP_STATUS.OK).json(await service.deactivate(Number(req.params.id)));
  });

  return router;
};
