import { Pool } from 'pg';
import { Member, MembershipType, NewMember } from '../../domain/Member';
import { MemberRepository } from '../../ports/MemberRepository';

type MemberRow = {
  id: number;
  name: string;
  email: string;
  membership_type: MembershipType;
  active: boolean;
};

const COLUMNS = 'id, name, email, membership_type, active';
const MAX_INTEGER_ID = 2147483647;

const toMember = (row: MemberRow): Member => ({
  id: row.id,
  name: row.name,
  email: row.email,
  membershipType: row.membership_type,
  active: row.active,
});

const isValidId = (id: number): boolean => Number.isInteger(id) && id > 0 && id <= MAX_INTEGER_ID;

export const createPostgresMemberRepository = (pool: Pool): MemberRepository => {
  const findAll = async (): Promise<Member[]> => {
    const result = await pool.query<MemberRow>(`SELECT ${COLUMNS} FROM members ORDER BY id`);
    return result.rows.map(toMember);
  };

  const findById = async (id: number): Promise<Member | undefined> => {
    if (!isValidId(id)) return undefined;
    const result = await pool.query<MemberRow>(`SELECT ${COLUMNS} FROM members WHERE id = $1`, [id]);
    return result.rows[0] ? toMember(result.rows[0]) : undefined;
  };

  const save = async (member: NewMember): Promise<Member> => {
    const result = await pool.query<MemberRow>(
      `INSERT INTO members (name, email, membership_type, active)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUMNS}`,
      [member.name, member.email, member.membershipType, member.active],
    );
    return toMember(result.rows[0]);
  };

  return { findAll, findById, save };
};
