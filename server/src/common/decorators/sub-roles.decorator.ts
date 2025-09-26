import { SetMetadata } from '@nestjs/common';
import { SubRole } from '@prisma/client';

export const SUB_ROLES_KEY = 'subRoles';
export const SubRoles = (...subRoles: SubRole[]) =>
  SetMetadata(SUB_ROLES_KEY, subRoles);
