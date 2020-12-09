import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { IFacility } from './interfaces/facility.interface';

@ApiTags('facility')
@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Get()
  async findAll(): Promise<IFacility[]> {
    return this.facilityService.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: number): Promise<IFacility> {
    return this.facilityService.find(id);
  }

  @Post()
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create facility' })
  async create(
    @Body(new ValidationPipe()) createFacilityDto: CreateFacilityDto,
  ): Promise<boolean> {
    return await this.facilityService.create(createFacilityDto);
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
