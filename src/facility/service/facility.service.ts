import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Facility } from '../schemas/facility.schema';
import { Connection, DocumentQuery, Model } from 'mongoose';
import { CreateFacilityDto } from '../dto/create-facility.dto';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel(Facility.name) private facilityModel: Model<Facility>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    const createdFacility = new this.facilityModel(createFacilityDto);
    return createdFacility.save();
  }

  async findAll(): Promise<Facility[]> {
    return this.facilityModel.find().exec();
  }

  async find(id: number): Promise<Facility> {
    const facility: DocumentQuery<
      Facility | null,
      Facility,
      {}
    > = this.facilityModel.findById(id);
    if (!facility) throw new Error('No facility found.');
    return facility;
  }

  async update(id: string, createFacilityDto: CreateFacilityDto) {
    const updateItem = await this.facilityModel.findByIdAndUpdate(
      id,
      createFacilityDto,
    );
    if (!updateItem) throw new Error('No facility found.');
  }

  async delete(id: number) {
    const deleteItem = await this.facilityModel.findByIdAndDelete(id);
    if (!deleteItem) throw new Error('No facility found.');
  }
}
