import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role, SubRole } from '@prisma/client';
import { UserFilterDto } from './dto/request/user-filter.dto';
import { UserRequest } from './entities/UserRequest.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dto/response/create-response.dto';
import {
  GetAllUserResponseDto,
  GetUserResponseDto,
} from './dto/response/read-response.dto';
import { UpdateUserResponseDto } from './dto/response/update-response.dto';
import { DeleteUserResponseDto } from './dto/response/delete-response.dto';
import { SubRolesGuard } from 'src/common/guards/subRoles.guard';
import { SubRoles } from 'src/common/decorators/sub-roles.decorator';

@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard, SubRolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @SubRoles(SubRole.ADMIN)
  @ApiResponse({
    type: CreateUserResponseDto,
    status: 201,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    type: GetAllUserResponseDto,
    status: 200,
  })
  findAll(
    @Query() filters: UserFilterDto,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.usersService.findAll(filters, req.user);
  }

  @Get(':id')
  @ApiResponse({
    type: GetUserResponseDto,
    status: 200,
  })
  findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: UserRequest },
  ) {
    if (id !== req.user.id && req.user.subRole === SubRole.USER)
      throw new UnauthorizedException(
        `User role ${req.user.role} not permitted for this action`,
      );
    const result = this.usersService.findOne(id);
    return result;
  }

  // @Patch('forgot/:id')
  // @ApiResponse({ type: String, status: 200 })
  // forgotPassword(
  //   @Param('id') id: string,
  //   @Body() dto: string,
  //   @Req() req: Request & { user: UserRequest },
  // ) {
  //   if (
  //     id !== req.user.id &&
  //     (req.user.subRole !== SubRole.ADMIN || req.user.role !== Role.SUPERADMIN)
  //   )
  //     throw new UnauthorizedException(
  //       `User role ${req.user.role} not permitted for this action`,
  //     );
  //   return this.usersService.forgot(id, dto);
  // }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    type: UpdateUserResponseDto,
    status: 200,
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: UserRequest },
  ) {
    if (
      id === req.user.id ||
      req.user.subRole === SubRole.ADMIN ||
      req.user.role === Role.SUPERADMIN
    ) {
      return this.usersService.update(id, updateUserDto);
    } else {
      throw new UnauthorizedException(
        `User role ${req.user.role} not permitted for this action`,
      );
    }
  }

  @Delete(':id')
  @SubRoles(SubRole.ADMIN)
  @ApiResponse({
    type: DeleteUserResponseDto,
    status: 200,
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
