import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMemberRepository } from './app';

describe('createMemberRepository', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses memory by default when MEMBERS_ADAPTER is not defined', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    expect(await createMemberRepository({}).findAll()).toEqual([]);
    expect(log).toHaveBeenCalledWith('Members persistence: in memory');
  });

  it('falls back to memory with a warning when MEMBERS_ADAPTER is sql but DATABASE_URL is missing', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(await createMemberRepository({ MEMBERS_ADAPTER: 'sql' }).findAll()).toEqual([]);
    expect(warn).toHaveBeenCalledWith('DATABASE_URL no está definida: se usará el repositorio en memoria');
  });

  it('uses PostgreSQL when MEMBERS_ADAPTER is sql and DATABASE_URL exists', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    createMemberRepository({ MEMBERS_ADAPTER: 'sql', DATABASE_URL: 'postgresql://user:pass@localhost:5432/db' });
    expect(log).toHaveBeenCalledWith('Members persistence: PostgreSQL with pg');
  });
});
