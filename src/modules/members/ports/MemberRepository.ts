import { Member, NewMember } from '../domain/Member';

export interface MemberRepository {
  findAll: () => Promise<Member[]>;
  findById: (id: number) => Promise<Member | undefined>;
  save: (member: NewMember) => Promise<Member>;
  deactivate: (id: number) => Promise<Member | undefined>;
}
