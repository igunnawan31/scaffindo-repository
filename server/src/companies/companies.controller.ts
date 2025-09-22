import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { UpdateCompanyDto } from './dto/request/update-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCompanyResponseDto } from './dto/response/create-response.dto';
import {
  GetAllCompanyResponseDto,
  GetCompanyResponseDto,
} from './dto/response/read-response.dto';
import { UpdateCompanyResponseDto } from './dto/response/update-response.dto';
import { DeleteCompanyResponseDto } from './dto/response/delete-response.dto';
import { GetUserResponseDto } from 'src/users/dto/response/read-response.dto';
import { CompanyFilterDto } from './dto/request/company-filter.dto';

@Controller('companies')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  @ApiResponse({ type: CreateCompanyResponseDto })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  @ApiResponse({ type: GetAllCompanyResponseDto })
  findAll(@Query() filters: CompanyFilterDto) {
    return this.companiesService.findAll(filters);
  }

  @Get(':id')
  @ApiResponse({ type: GetCompanyResponseDto })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ type: UpdateCompanyResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: Request & { user: GetUserResponseDto },
  ) {
    if (id != req.user.companyId && req.user.role !== 'SUPERADMIN') {
      throw new NotFoundException(
        `User role ${req.user.role} not permitted for this action`,
      );
    }
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  @ApiResponse({ type: DeleteCompanyResponseDto })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
