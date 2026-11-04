import { NotFoundError } from '../../../shared/NotFoundError';
import { Member, parseNewMember } from '../domain/Member';
import { MemberRepository } from '../ports/MemberRepository';

const MEMBER_NOT_FOUND = 'Socio no encontrado';

export class MemberService {
  constructor(private readonly repository: MemberRepository) {}

  list = (): Promise<Member[]> => this.repository.findAll();

  getById = async (id: number): Promise<Member> => {
    const member = await this.repository.findById(id);
    if (!member) throw new NotFoundError(MEMBER_NOT_FOUND);
    return member;
  };

  create = async (input: unknown): Promise<Member> => this.repository.save(parseNewMember(input));

  deactivate = async (id: number): Promise<Member> => {
    const member = await this.repository.deactivate(id);
    if (!member) throw new NotFoundError(MEMBER_NOT_FOUND);
    return member;
  };
}
