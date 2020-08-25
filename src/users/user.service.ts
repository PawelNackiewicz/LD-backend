import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { IUser } from './interfaces/user.interface';
import { IReadableUser } from './interfaces/readable-user.interface';
import { userSensitiveFieldsEnum } from './enums/protected-fields.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto, roles: string[]): Promise<IUser> {
    const hash = await this.hashPassword(createUserDto.password);
    const createdUser = new this.userModel({...createUserDto, password: hash, roles});
    await createdUser.save();
    return createdUser;
  }

  async find(id: string): Promise<IUser> {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<IUser> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (e) {
      console.log(e);
    }
  }

  async update(id: string, payload: Partial<IUser>) {
    return this.userModel.updateOne({ _id: id }, payload);
  }
}
