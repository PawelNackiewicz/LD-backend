import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { IFacility } from './interfaces/facility.interface';
import { AuthService } from '../auth/auth.service';
import { roleEnum } from '../users/enums/role.enums';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel('Facility') private readonly facilityModel: Model<IFacility>,
    private readonly authService: AuthService,
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

  async findAllByUser(userId: string): Promise<IFacility[]> {
    try {
      return await this.facilityModel.find({ userId }).exec();
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
    createFacilityDto: Partial<CreateFacilityDto>,
    token: string,
  ): Promise<void> {
    try {
      const { roles, _id } = await this.authService.getUserInfo(token);
      const facilityToEdit = await this.facilityModel.findById(id);
      if (roles.includes(roleEnum.admin) || String(_id) === facilityToEdit.userId) {
        await this.facilityModel.findByIdAndUpdate(id, createFacilityDto);
      }
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

  async delete(id: number, token: string): Promise<void> {
    try {
      const { roles, _id } = await this.authService.getUserInfo(token);
      const facilityToDelete = await this.facilityModel.findById(id);
      if (roles.includes(roleEnum.admin) || String(_id) === facilityToDelete.userId) {
        await this.facilityModel.findByIdAndDelete(id);
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
