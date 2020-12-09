import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { IFacility } from './interfaces/facility.interface';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel('Facility') private readonly facilityModel: Model<IFacility>,
  ) {}

  async create(createFacilityDto: CreateFacilityDto): Promise<boolean> {
    try {
      const createdFacility = new this.facilityModel(createFacilityDto);
      await createdFacility.save();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async findAll(): Promise<IFacility[]> {
    try {
      return this.facilityModel.find().exec();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async find(id: number): Promise<IFacility> {
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
      return null;
    }
  }
}
