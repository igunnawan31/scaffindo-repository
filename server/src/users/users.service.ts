import { Injectable, NotFoundException } from '@nestjs/common';
import { UserFilterDto } from './dto/request/user-filter.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { plainToInstance } from 'class-transformer';
import {
  GetAllUserResponseDto,
  GetUserResponseDto,
} from './dto/response/read-response.dto';
import { handlePrismaError } from 'src/common/utils/prisma-exception.util';
import * as bcrypt from 'bcryptjs';
import { CreateUserResponseDto } from './dto/response/create-response.dto';
import { Prisma } from '@prisma/client';
import { UpdateUserResponseDto } from './dto/response/update-response.dto';
import { DeleteUserResponseDto } from './dto/response/delete-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    try {
      const hashed = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashed;
      const user = await this.prisma.user.create({
        data: { ...createUserDto, password: createUserDto.password },
      });
      return plainToInstance(CreateUserResponseDto, user);
    } catch (error) {
      handlePrismaError(error, 'User');
    }
  }

  async findAll(filters: UserFilterDto): Promise<GetAllUserResponseDto> {
    const { name, role, companyId, subRole, page = 1, limit = 10 } = filters;
    try {
      const where: Prisma.UserWhereInput = {
        role: role ?? undefined,
        subRole: subRole ?? undefined,
        companyId: companyId ?? undefined,
        ...(name && {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        }),
      };
      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.user.count({ where }),
      ]);
      if (users.length === 0) throw new NotFoundException('No Users Found');
      const res: GetAllUserResponseDto = {
        data: users.map((r) => plainToInstance(GetUserResponseDto, r)),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
      return res;
    } catch (error) {
      handlePrismaError(error, 'User');
    }
  }

  async findOne(id: string): Promise<GetUserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, name: true, role: true },
      });
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      return plainToInstance(GetUserResponseDto, user);
    } catch (error) {
      handlePrismaError(error, 'User', id);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    try {
      const target = await this.prisma.user.findUnique({ where: { id } });
      if (!target) throw new NotFoundException(`User ${id} not found`);
      const updateData: Partial<UpdateUserDto> = {
        name: updateUserDto.name,
        companyId: updateUserDto.companyId,
        role: updateUserDto.role,
        subRole: updateUserDto.subRole,
      };

      // Only hash and include password if it's provided and non-empty
      if (
        updateUserDto.password !== undefined &&
        updateUserDto.password.trim() !== ''
      ) {
        const hashed = await bcrypt.hash(updateUserDto.password, 10);
        updateData.password = hashed;
      }

      const result = await this.prisma.user.update({
        data: updateData,
        where: { id },
      });

      return plainToInstance(UpdateUserResponseDto, result);
    } catch (error) {
      handlePrismaError(error, 'User', id);
    }
  }

  async remove(id: string): Promise<DeleteUserResponseDto> {
    try {
      const target = await this.prisma.user.findUnique({ where: { id } });
      if (!target) throw new NotFoundException(`User ${id} not found`);
      const result = await this.prisma.user.delete({ where: { id } });
      return plainToInstance(DeleteUserResponseDto, result);
    } catch (error) {
      handlePrismaError(error, 'User', id);
    }
  }
}
