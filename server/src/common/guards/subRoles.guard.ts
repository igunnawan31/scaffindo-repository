import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, SubRole } from '@prisma/client';
import { SUB_ROLES_KEY } from '../decorators/sub-roles.decorator';

// Define the request type with user attached
interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: Role;
    subRole: SubRole;
  };
}

@Injectable()
export class SubRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<SubRole[]>(
      SUB_ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!requiredRoles) {
      return true; // no roles required
    }

    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    // Superadmin bypass
    if (user.role === Role.SUPERADMIN) {
      return true;
    }

    const subRole = user.subRole;
    if (!subRole) {
      throw new ForbiddenException('No role found for user');
    }

    if (!requiredRoles.includes(subRole)) {
      throw new ForbiddenException(
        `User role ${subRole} not permitted for this action`,
      );
    }

    return true;
  }
}
