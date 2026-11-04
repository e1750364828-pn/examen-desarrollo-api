import { DomainError } from '../../../shared/DomainError';

export const MEMBERSHIP_TYPES = ['estudiante', 'docente', 'externo'] as const;

export type MembershipType = (typeof MEMBERSHIP_TYPES)[number];

export type NewMember = {
  name: string;
  email: string;
  membershipType: MembershipType;
  active: boolean;
};

export type Member = NewMember & {
  id: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isBlank = (value: unknown): boolean => typeof value !== 'string' || value.trim() === '';

const isMembershipType = (value: unknown): value is MembershipType =>
  typeof value === 'string' && (MEMBERSHIP_TYPES as readonly string[]).includes(value);

export const parseNewMember = (input: unknown): NewMember => {
  const data = (input ?? {}) as Record<string, unknown>;

  if (isBlank(data.name)) {
    throw new DomainError('El nombre es obligatorio');
  }

  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (!EMAIL_PATTERN.test(email)) {
    throw new DomainError('El correo no tiene un formato válido');
  }

  if (!isMembershipType(data.membershipType)) {
    throw new DomainError('El tipo de membresía no es válido');
  }

  if (data.active !== undefined && typeof data.active !== 'boolean') {
    throw new DomainError('El estado debe ser verdadero o falso');
  }

  return {
    name: (data.name as string).trim(),
    email,
    membershipType: data.membershipType,
    active: data.active ?? true,
  };
};
