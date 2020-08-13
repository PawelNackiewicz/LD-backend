import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    try {
      const createdUser = new this.userModel(createUserDto);
      await createdUser.save();
    } catch (e) {
      console.error(e);
    }
  }

  async findOne(email: string): Promise<IUser> {
    try {
      return this.userModel.findOne({ email });
    } catch (e) {
      console.error(e);
    }
  }
}
