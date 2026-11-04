import 'dotenv/config';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { createPostgresPool } from '../../../../shared/database/postgres';
import { NewMember } from '../../domain/Member';
import { MemberRepository } from '../../ports/MemberRepository';
import { createPostgresMemberRepository } from './PostgresMemberRepository';

const { DATABASE_URL, TEST_DATABASE_URL } = process.env;

if (!TEST_DATABASE_URL) {
  throw new Error('Defina TEST_DATABASE_URL en el archivo .env para ejecutar las pruebas de integración');
}
if (TEST_DATABASE_URL === DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL no puede ser igual a DATABASE_URL: las pruebas borran los datos');
}

const lucia: NewMember = {
  name: 'Lucía Mendoza',
  email: 'lucia.mendoza@correo.com',
  membershipType: 'estudiante',
  active: true,
};
const jorge: NewMember = {
  name: 'Jorge Salazar',
  email: 'jorge.salazar@correo.com',
  membershipType: 'docente',
  active: false,
};

describe('PostgresMemberRepository (integration)', () => {
  let pool: Pool;
  let repository: MemberRepository;

  beforeAll(() => {
    pool = createPostgresPool(TEST_DATABASE_URL);
    repository = createPostgresMemberRepository(pool);
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE members RESTART IDENTITY');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('returns an empty list when the table is empty', async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a member and assigns a numeric id', async () => {
    const saved = await repository.save(lucia);
    expect(saved).toEqual({ id: expect.any(Number), ...lucia });
    expect((await repository.save(jorge)).id).toBe(saved.id + 1);
  });

  it('lists all members ordered by id', async () => {
    const first = await repository.save(lucia);
    const second = await repository.save(jorge);
    expect(await repository.findAll()).toEqual([first, second]);
  });

  it('finds an existing member by id', async () => {
    const saved = await repository.save(jorge);
    expect(await repository.findById(saved.id)).toEqual(saved);
  });

  it('returns undefined when the member does not exist', async () => {
    expect(await repository.findById(9999)).toBeUndefined();
    expect(await repository.findById(Number.NaN)).toBeUndefined();
    expect(await repository.findById(99999999999)).toBeUndefined();
  });
});
