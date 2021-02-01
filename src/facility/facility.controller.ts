import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
import { AuthGuard } from '../auth/auth.guard';
import { Types } from 'mongoose';

@ApiTags('facilities')
@Controller()
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Get('facilities')
  @ApiOperation({ summary: 'Get all facilities' })
  async findAll(): Promise<IFacility[]> {
    return this.facilityService.findAll();
  }

  @Get('users/:userId/facilities')
  @ApiOperation({ summary: 'Get all facilities by userId' })
  async findAllByUser(@Param('userId') userId: string): Promise<IFacility[]> {
    if (Types.ObjectId.isValid(userId)) {
      return this.facilityService.findAllByUser(userId);
    } else {
      throw new NotFoundException();
    }
  }

  @Get('facilities/:id')
  @ApiOperation({ summary: 'Get facility by id' })
  async find(@Param('id') id: string): Promise<IFacility> {
    if (Types.ObjectId.isValid(id)) {
      return this.facilityService.find(id);
    } else {
      throw new NotFoundException();
    }
  }

  @Post('facilities')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiOperation({ summary: 'Create facility' })
  async create(
    @Body(new ValidationPipe()) createFacilityDto: CreateFacilityDto,
  ): Promise<IFacility> {
    return await this.facilityService.create(createFacilityDto);
  }

  @Put('facilities/:id')
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
    if (Types.ObjectId.isValid(id)) {
      return this.facilityService.update(id, createFacilityDto, cookies.token);
    } else {
      throw new NotFoundException();
    }
  }

  @Delete('facilities/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string, @Cookies() cookies) {
    if (Types.ObjectId.isValid(id)) {
      return this.facilityService.delete(id, cookies.token).then();
    } else {
      throw new NotFoundException();
    }
  }
}
