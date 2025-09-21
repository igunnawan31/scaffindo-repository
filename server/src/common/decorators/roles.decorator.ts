import { SetMetadata } from '@nestjs/common';
import { Role, SubRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (Role | SubRole)[]) =>
  SetMetadata(ROLES_KEY, roles);
