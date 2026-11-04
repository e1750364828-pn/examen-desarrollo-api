import { describe, expect, it } from 'vitest';
import { DomainError } from '../../../shared/DomainError';
import { parseNewMember } from './Member';

const validMember = {
  name: 'Lucía Mendoza',
  email: 'lucia.mendoza@correo.com',
  membershipType: 'estudiante',
};

describe('parseNewMember', () => {
  it('returns a valid member with active true by default', () => {
    expect(parseNewMember({ ...validMember, name: '  Lucía Mendoza ' })).toEqual({ ...validMember, active: true });
  });

  it('accepts every membership type and an explicit active value', () => {
    expect(parseNewMember({ ...validMember, membershipType: 'docente', active: false })).toEqual({
      ...validMember,
      membershipType: 'docente',
      active: false,
    });
    expect(parseNewMember({ ...validMember, membershipType: 'externo', active: true }).membershipType).toBe('externo');
  });

  it('fails when name is missing', () => {
    const message = 'El nombre es obligatorio';
    expect(() => parseNewMember({ ...validMember, name: '' })).toThrow(DomainError);
    expect(() => parseNewMember({ ...validMember, name: '   ' })).toThrow(message);
    expect(() => parseNewMember({ ...validMember, name: undefined })).toThrow(message);
    expect(() => parseNewMember(undefined)).toThrow(message);
  });

  it('fails when email has an invalid format', () => {
    const message = 'El correo no tiene un formato válido';
    expect(() => parseNewMember({ ...validMember, email: 'lucia.correo.com' })).toThrow(message);
    expect(() => parseNewMember({ ...validMember, email: 'lucia@correo' })).toThrow(message);
    expect(() => parseNewMember({ ...validMember, email: undefined })).toThrow(message);
  });

  it('fails when membershipType is not estudiante, docente or externo', () => {
    const message = 'El tipo de membresía no es válido';
    expect(() => parseNewMember({ ...validMember, membershipType: 'administrativo' })).toThrow(message);
    expect(() => parseNewMember({ ...validMember, membershipType: undefined })).toThrow(message);
  });

  it('fails when active is not true or false', () => {
    const message = 'El estado debe ser verdadero o falso';
    expect(() => parseNewMember({ ...validMember, active: 'si' })).toThrow(message);
    expect(() => parseNewMember({ ...validMember, active: 1 })).toThrow(message);
    expect(() => parseNewMember({ ...validMember, active: null })).toThrow(message);
  });
});
