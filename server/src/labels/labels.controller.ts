import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { LabelsService } from './labels.service';
import { UpdateLabelDto } from './dto/request/update-label.dto';
import { LabelFilterDto } from './dto/request/label-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRequest } from 'src/users/entities/UserRequest.dto';
import { BuyDto } from './dto/request/buy.dto';
import { BulkBuyDto } from './dto/request/bulkBuy.dto';

@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  // @Post()
  // create(@Body() createLabelDto: CreateLabelDto) {
  //   return this.labelsService.create(createLabelDto);
  // }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll(@Query() filters: LabelFilterDto) {
    return this.labelsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labelsService.findOne(id);
  }

  @Patch('buy/bulk')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  bulkBuy(
    @Body() dto: BulkBuyDto,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.labelsService.bulkBuy(dto, req.user);
  }

  @Patch('buy/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  buy(
    @Param('id') id: string,
    @Body() dto: BuyDto,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.labelsService.buy(id, dto, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateLabelDto: UpdateLabelDto,
    @Req() req: Request & { user: UserRequest },
  ) {
    return this.labelsService.update(id, updateLabelDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string, @Req() req: Request & { user: UserRequest }) {
    return this.labelsService.remove(id, req.user);
  }
}
