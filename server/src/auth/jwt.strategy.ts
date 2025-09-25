import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Role, SubRole } from '@prisma/client';
import { JwtPayload } from './types/auth.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: JwtPayload): Promise<{
    id: string;
    email: string;
    role: Role;
    subRole: SubRole;
    exp: number;
    companyId: string;
  }> {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      subRole: payload.subRole,
      exp: payload.exp,
      companyId: payload.companyId,
    };
  }
}
