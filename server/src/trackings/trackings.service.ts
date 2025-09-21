import { Injectable } from '@nestjs/common';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { UpdateTrackingDto } from './dto/update-tracking.dto';

@Injectable()
export class TrackingsService {
  create(createTrackingDto: CreateTrackingDto) {
    return 'This action adds a new tracking';
  }

  findAll() {
    return `This action returns all trackings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tracking`;
  }

  update(id: number, updateTrackingDto: UpdateTrackingDto) {
    return `This action updates a #${id} tracking`;
  }

  remove(id: number) {
    return `This action removes a #${id} tracking`;
  }
}
