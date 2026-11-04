import express, { Express } from 'express';
import { createMemberRoutes } from './modules/members/adapters/http/memberRoutes';
import { createInMemoryMemberRepository } from './modules/members/adapters/persistence/InMemoryMemberRepository';
import { createPostgresMemberRepository } from './modules/members/adapters/persistence/PostgresMemberRepository';
import { MemberService } from './modules/members/application/MemberService';
import { MemberRepository } from './modules/members/ports/MemberRepository';
import { createPostgresPool } from './shared/database/postgres';
import { errorHandler } from './shared/errorHandler';

export const createMemberRepository = (env: NodeJS.ProcessEnv = process.env): MemberRepository => {
  const { MEMBERS_ADAPTER, DATABASE_URL } = env;

  if (MEMBERS_ADAPTER === 'sql' && DATABASE_URL) {
    console.log('Members persistence: PostgreSQL with pg');
    return createPostgresMemberRepository(createPostgresPool(DATABASE_URL));
  }

  if (MEMBERS_ADAPTER === 'sql') {
    console.warn('DATABASE_URL no está definida: se usará el repositorio en memoria');
  }
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
