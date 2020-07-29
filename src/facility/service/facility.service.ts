import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Facility } from '../schemas/facility.schema';
import { Connection, Model } from 'mongoose';
import { CreateFacilityDto } from '../dto/create-facility.dto';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel(Facility.name) private facilityModel: Model<Facility>,
    @InjectConnection() private connection: Connection,
  ) {
  }

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
    }
  }

  async find(id: number): Promise<Facility> {
    try {
      return this.facilityModel.findById(id);
    } catch (e) {
      console.error(e);
    }
  }

  async update(id: string, createFacilityDto: CreateFacilityDto): Promise<void> {
    try {
      await this.facilityModel.findByIdAndUpdate(
        id,
        createFacilityDto,
      );
    } catch (e) {
      console.error(e);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.facilityModel.findByIdAndDelete(id);
    } catch (e) {
      console.error(e);
    }
  }
}
