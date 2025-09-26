import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserResponseDto } from 'src/users/dto/response/update-response.dto';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from 'src/common/utils/prisma-exception.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      subRole: user.subRole,
      companyId: user.companyId,
    };

    // Generate refresh token (long-lived)
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subRole: user.subRole,
        companyId: user.companyId,
      },
    };
  }

  async register(data: RegisterDto) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashed },
    });
    return this.login(user);
  }

  async forgot(id: string, dto: string): Promise<UpdateUserResponseDto> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: id },
      });
      if (!existingUser) throw new NotFoundException(`User ${id} not found`);
      const hashed = await bcrypt.hash(dto, 10);
      const result = await this.prisma.user.update({
        data: {
          password: hashed,
        },
        where: { id },
      });
      return plainToInstance(UpdateUserResponseDto, result);
    } catch (err) {
      handlePrismaError(err, 'User', id);
    }
  }
}
