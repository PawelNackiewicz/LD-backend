import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Facility } from './models/facility.schema';
import { Model } from 'mongoose';
import { CreateFacilityDto } from './models/create-facility.dto';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel(Facility.name) private facilityModel: Model<Facility>,
  ) {}

  async create(createFacilityDto: CreateFacilityDto): Promise<void> {
    try {
      const createdFacility = new this.facilityModel(createFacilityDto);
      await createdFacility.save();
    } catch (e) {
      console.error(e);
    }
  }

  async findAll(): Promise<Facility[]> {
    try {
      return this.facilityModel.find().exec();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async find(id: number): Promise<Facility> {
    try {
      return this.facilityModel.findById(id);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async update(
    id: string,
    createFacilityDto: CreateFacilityDto,
  ): Promise<void> {
    try {
      await this.facilityModel.findByIdAndUpdate(id, createFacilityDto);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.facilityModel.findByIdAndDelete(id);
    } catch (e) {
      console.error(e);
      return null
    }
  }
}
