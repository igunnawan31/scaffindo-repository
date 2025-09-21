import { Role, SubRole } from '@prisma/client';

export class UserRequest {
  id: string;
  name: string;
  email: string;
  role: Role;
  subRole: SubRole;
}
