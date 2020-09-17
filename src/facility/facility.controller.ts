import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './models/create-facility.dto';
import { Facility } from './models/facility.schema';

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

  @Post()
  async create(@Body() createFacilityDto: CreateFacilityDto) {
    await this.facilityService.create(createFacilityDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() createFacilityDto: CreateFacilityDto,
  ) {
    return this.facilityService.update(id, createFacilityDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.facilityService.delete(id).then();
  }
}
