import { Role, SubRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  subRole: SubRole;
  exp: number;
}
