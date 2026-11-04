import { Pool } from 'pg';

export const createPostgresPool = (connectionString: string): Pool =>
  new Pool({ connectionString, connectionTimeoutMillis: 3000 });
