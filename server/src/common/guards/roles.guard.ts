import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role, SubRole } from '@prisma/client';

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
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<(Role | SubRole)[]>(
      ROLES_KEY,
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

    const role = user.role;
    if (!role) {
      throw new ForbiddenException('No role found for user');
    }

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException(
        `User role ${role} not permitted for this action`,
      );
    }

    return true;
  }
}
