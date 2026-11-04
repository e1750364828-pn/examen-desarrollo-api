import { Member, NewMember } from '../../domain/Member';
import { MemberRepository } from '../../ports/MemberRepository';

const copy = (member: Member): Member => ({ ...member });

export const createInMemoryMemberRepository = (initial: Member[] = []): MemberRepository => {
  const members: Member[] = initial.map(copy);
  let nextId = members.reduce((max, member) => Math.max(max, member.id), 0) + 1;

  const findAll = async (): Promise<Member[]> => members.map(copy);

  const findById = async (id: number): Promise<Member | undefined> => {
    const member = members.find((item) => item.id === id);
    return member ? copy(member) : undefined;
  };

  const save = async (newMember: NewMember): Promise<Member> => {
    const member: Member = { id: nextId++, ...newMember };
    members.push(member);
    return copy(member);
  };

  const deactivate = async (id: number): Promise<Member | undefined> => {
    const member = members.find((item) => item.id === id);
    if (!member) return undefined;
    member.active = false;
    return copy(member);
  };

  return { findAll, findById, save, deactivate };
};
