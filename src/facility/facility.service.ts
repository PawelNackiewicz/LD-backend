import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { IFacility } from './interfaces/facility.interface';
import { AuthService } from '../auth/auth.service';
import { roleEnum } from '../users/enums/role';

@Injectable()
export class FacilityService {
  constructor(
    @InjectModel('Facility') private readonly facilityModel: Model<IFacility>,
    private readonly authService: AuthService,
  ) {}

  async create(createFacilityDto: CreateFacilityDto): Promise<void> {
    try {
      console.log(createFacilityDto);
      const createdFacility = new this.facilityModel(createFacilityDto);
      await createdFacility.save();
    } catch (e) {
      console.error(e);
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

  async find(id: string): Promise<IFacility> {
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
    const { roles, _id } = await this.authService.getUserInfo(token);
    const facilityToEdit = await this.facilityModel.findById(id);
    if (!facilityToEdit)
      throw new HttpException('Facility not found', HttpStatus.NOT_FOUND);

    if (
      roles.includes(roleEnum.admin) ||
      String(_id) === facilityToEdit.userId
    ) {
      console.log(createFacilityDto); //check if DTO is correct?
      await this.facilityModel
        .findByIdAndUpdate(id, createFacilityDto)
        .then(() => {
          console.log('pawi');
        })
        .catch(() => {
          console.log('error');
        });
    }
  }

  async delete(id: number, token: string): Promise<void> {
    const { roles, _id } = await this.authService.getUserInfo(token);
    const facilityToDelete = await this.facilityModel.findById(id);
    if (!facilityToDelete)
      throw new HttpException('Facility not found', HttpStatus.NOT_FOUND);
    if (
      roles.includes(roleEnum.admin) ||
      String(_id) === facilityToDelete.userId
    ) {
      await this.facilityModel.findByIdAndDelete(id);
    }
  }
}
