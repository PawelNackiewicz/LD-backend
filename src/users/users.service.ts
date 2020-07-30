import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './models/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import { Facility } from '../facility/models/facility.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    try {
      const createdUser = new this.userModel(createUserDto);
      await createdUser.save();
    } catch (e) {
      console.error(e);
    }
  }

  async findOne(email: string): Promise<User> {
    try {
      return this.userModel.findOne({ email });
    } catch (e) {
      console.error(e);
    }
  }
}
