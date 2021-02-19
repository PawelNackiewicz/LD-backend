import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { Facility } from './interfaces/facility.interface';
import { AuthService } from '../auth/auth.service';
import { roleEnum } from '../users/enums/role';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel('Facility') private readonly facilityModel: Model<Facility>,
    private readonly authService: AuthService,
  ) {}

  async create(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    return await this.facilityModel.create(createFacilityDto as Facility);
  }

  async findAll(): Promise<Facility[]> {
    return await this.facilityModel.find().exec();
  }

  async findAllByUser(userId: string): Promise<Facility[]> {
    return await this.facilityModel.find({ userId }).exec();
  }

  async find(id: string): Promise<Facility> {
    return await this.facilityModel.findById(id).exec();
  }

  async update(
    id: string,
    createFacilityDto: Partial<CreateFacilityDto>,
    token: string,
  ): Promise<Facility | void> {
    const { roles, _id } = await this.authService.getUserInfo(token);
    const facilityToEdit = await this.facilityModel.findById(id);
    if (!facilityToEdit) throw new NotFoundException('Facility not found');

    if (
      roles.includes(roleEnum.admin) ||
      String(_id) === facilityToEdit.userId
    ) {
      return this.facilityModel
        .findByIdAndUpdate(id, createFacilityDto);
    }
  }

  async delete(id: string, token: string): Promise<Facility | void> {
    const { roles, _id } = await this.authService.getUserInfo(token);
    const facilityToDelete = await this.facilityModel.findById(id);
    if (!facilityToDelete) throw new NotFoundException('Facility not found');
    if (
      roles.includes(roleEnum.admin) ||
      String(_id) === facilityToDelete.userId
    ) {
      return this.facilityModel.findByIdAndDelete(id);
    }
  }
}
