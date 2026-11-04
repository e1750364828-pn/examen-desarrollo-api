import { describe, expect, it } from 'vitest';
import { NewMember } from '../../domain/Member';
import { createInMemoryMemberRepository } from './InMemoryMemberRepository';

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

describe('InMemoryMemberRepository', () => {
  it('starts empty', async () => {
    expect(await createInMemoryMemberRepository().findAll()).toEqual([]);
  });

  it('saves a member and assigns an incremental id', async () => {
    const repository = createInMemoryMemberRepository();
    expect(await repository.save(lucia)).toEqual({ id: 1, ...lucia });
    expect(await repository.save(jorge)).toEqual({ id: 2, ...jorge });
  });

  it('lists members returning copies of the stored data', async () => {
    const repository = createInMemoryMemberRepository();
    await repository.save(lucia);
    const list = await repository.findAll();
    list[0].name = 'Modificado';
    list.pop();
    expect(await repository.findAll()).toEqual([{ id: 1, ...lucia }]);
  });

  it('finds a member by id or returns undefined', async () => {
    const repository = createInMemoryMemberRepository([{ id: 5, ...lucia }]);
    expect(await repository.findById(5)).toEqual({ id: 5, ...lucia });
    expect(await repository.findById(99)).toBeUndefined();
    expect((await repository.save(jorge)).id).toBe(6);
  });
});
