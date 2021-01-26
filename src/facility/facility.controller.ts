import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { IFacility } from './interfaces/facility.interface';
import { Cookies } from '@nestjsplus/cookies/index';
import { AuthGuard } from '../auth/auth.quard';

@ApiTags('facility')
@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all facilities' })
  async findAll(): Promise<IFacility[]> {
    return this.facilityService.findAll();
  }

  @Get('all/:userId')
  @ApiOperation({ summary: 'Get all facilities by userId' })
  async findAllByUser(@Param('userId') userId: string): Promise<IFacility[]> {
    return this.facilityService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get facility by id' })
  async find(@Param('id') id: string): Promise<IFacility> {
    return this.facilityService.find(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiOperation({ summary: 'Create facility' })
  async create(
    @Body(new ValidationPipe()) createFacilityDto: CreateFacilityDto,
  ): Promise<void> {
    return await this.facilityService.create(createFacilityDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 400, description: 'Validation error, bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiOperation({ summary: 'Update facility' })
  async update(
    @Param('id') id: string,
    @Body() createFacilityDto: Partial<CreateFacilityDto>,
    @Cookies() cookies,
  ) {
    return this.facilityService
      .update(id, createFacilityDto, cookies.token)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number, @Cookies() cookies) {
    return this.facilityService.delete(id, cookies.token).then();
  }
}
