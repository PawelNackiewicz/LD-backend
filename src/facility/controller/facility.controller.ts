import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FacilityService } from '../service/facility.service';
import { CreateFacilityDto } from '../dto/create-facility.dto';
import { Facility } from '../schemas/facility.schema';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Get()
  async findAll(): Promise<Facility[]> {
    return this.facilityService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: number): Promise<Facility> {
    return this.facilityService.find(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createFacilityDto: CreateFacilityDto) {
    await this.facilityService.create(createFacilityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() createFacilityDto: CreateFacilityDto,
  ) {
    return this.facilityService.update(id, createFacilityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.facilityService.delete(id).then();
  }
}
