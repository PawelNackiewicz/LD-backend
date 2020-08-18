import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserToken } from './interfaces/user-token.interface';
import { CreateUserTokenDto } from './dto/create-user-token.dto';

@Injectable()
export class TokenService {
  constructor(@InjectModel('Token') private readonly tokenModel: Model<IUserToken>) {
  }

  async create(createUserTokenDto: CreateUserTokenDto): Promise<IUserToken> {
    const userToken = new this.tokenModel(createUserTokenDto);
    return await userToken.save();
  }

  async delete(userId: string, token: string): Promise<{ ok?: number, n?: number }> {
    return await this.tokenModel.deleteOne({ userId, token });
  }

  async deleteAll(userId: string): Promise<{ ok?: number, n?: number }> {
    return await this.tokenModel.deleteMany({ userId });
  }

  async getUserId(token: string): Promise<string> {
    return await this.tokenModel.findOne({ token }).exec().then(token => {
      if (!this.tokenActive(token.expireAt)) throw new ForbiddenException();
      return token.userId;
    }).catch((error) => {
      if (error.status === 403) throw new ForbiddenException('Token is expired');
      throw new NotFoundException('Token not found');
    });
  }

  tokenActive(expireAt: string): boolean {
    return new Date(expireAt) > new Date(Date.now());
  }
}
