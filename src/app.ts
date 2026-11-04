import express, { Express } from 'express';
import { createMemberRoutes } from './modules/members/adapters/http/memberRoutes';
import { createInMemoryMemberRepository } from './modules/members/adapters/persistence/InMemoryMemberRepository';
import { MemberService } from './modules/members/application/MemberService';
import { MemberRepository } from './modules/members/ports/MemberRepository';
import { errorHandler } from './shared/errorHandler';

export const createMemberRepository = (): MemberRepository => {
  console.log('Members persistence: in memory');
  return createInMemoryMemberRepository();
};

export const createApp = (memberRepository: MemberRepository = createInMemoryMemberRepository()): Express => {
  const app = express();
  app.use(express.json());

  app.use('/members', createMemberRoutes(new MemberService(memberRepository)));

  app.use(errorHandler);
  return app;
};
