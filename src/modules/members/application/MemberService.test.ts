import { describe, expect, it } from 'vitest';
import { DomainError } from '../../../shared/DomainError';
import { NotFoundError } from '../../../shared/NotFoundError';
import { createInMemoryMemberRepository } from '../adapters/persistence/InMemoryMemberRepository';
import { Member } from '../domain/Member';
import { MemberService } from './MemberService';

const lucia: Member = {
  id: 1,
  name: 'Lucía Mendoza',
  email: 'lucia.mendoza@correo.com',
  membershipType: 'estudiante',
  active: true,
};
const newMember = {
  name: 'Jorge Salazar',
  email: 'jorge.salazar@correo.com',
  membershipType: 'docente',
};

const buildService = () => new MemberService(createInMemoryMemberRepository([lucia]));

describe('MemberService', () => {
  it('lists members', async () => {
    expect(await buildService().list()).toEqual([lucia]);
    expect(await new MemberService(createInMemoryMemberRepository()).list()).toEqual([]);
  });

  it('gets a member by id', async () => {
    expect(await buildService().getById(1)).toEqual(lucia);
  });

  it('throws NotFoundError when the member does not exist', async () => {
    const service = buildService();
    await expect(service.getById(99)).rejects.toThrow(NotFoundError);
    await expect(service.getById(99)).rejects.toThrow('Socio no encontrado');
  });

  it('creates a valid member with active true by default', async () => {
    const service = buildService();
    const created = await service.create(newMember);
    expect(created).toEqual({ id: 2, ...newMember, active: true });
    expect(await service.getById(2)).toEqual(created);
  });

  it('rejects invalid data with a DomainError and does not save it', async () => {
    const service = buildService();
    await expect(service.create({ ...newMember, email: 'invalido' })).rejects.toThrow(DomainError);
    await expect(service.create({ ...newMember, membershipType: 'otro' })).rejects.toThrow(
      'El tipo de membresía no es válido',
    );
    expect(await service.list()).toHaveLength(1);
  });

  it('deactivates a member and throws NotFoundError when it does not exist', async () => {
    const service = buildService();
    expect(await service.deactivate(1)).toEqual({ ...lucia, active: false });
    expect((await service.getById(1)).active).toBe(false);
    await expect(service.deactivate(99)).rejects.toThrow('Socio no encontrado');
  });
});
