import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserToken } from './interfaces/user-token.interface';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { JWE, JWK, JWT } from 'jose';
import * as crypto from 'crypto';
import { IUser } from '../users/interfaces/user.interface';
import { statusEnum } from '../users/enums/status.enums';
import * as moment from 'moment';

@Injectable()
export class TokenService {
  private readonly JOSE_BITLENGTH = 2048;
  private readonly jwtKey = JWK.generateSync('oct', this.JOSE_BITLENGTH, {
    use: 'sig',
  });
  private readonly jweKey = JWK.generateSync('RSA', this.JOSE_BITLENGTH, {
    use: 'enc',
  });

  constructor(
    @InjectModel('Token') private readonly tokenModel: Model<IUserToken>,
  ) {}

  async getActivationToken(userEmail: string): Promise<string> {
    return JWE.encrypt(
      JWT.sign({ userEmail }, this.jwtKey, {
        algorithm: 'HS512',
        expiresIn: '8 hours',
      }),
      this.jweKey,
    );
  }

  async signUser(
    user: IUser,
    withStatusCheck: boolean = true,
  ): Promise<string> {
    if (withStatusCheck && user.status !== statusEnum.active) {
      throw new UnauthorizedException();
    }
    // 4. generate token
    const token = await TokenService.generateToken();
    const expireAt = moment()
      .add(1, 'day')
      .toISOString();

    // 5. save token with user and expired time in database
    await this.create({
      token,
      expireAt,
      userId: user._id,
    });

    return token;
  }

  private static async generateToken(): Promise<string> {
    return crypto.randomBytes(48).toString('hex');
  }

  async verifyActivationToken(token: string) {
    return JWT.verify(JWE.decrypt(token, this.jweKey).toString(), this.jwtKey, {
      algorithms: ['HS512'],
      maxTokenAge: '8 hours',
    });
  }

  async create(createUserTokenDto: CreateUserTokenDto): Promise<IUserToken> {
    const userToken = new this.tokenModel(createUserTokenDto);
    return await userToken.save();
  }

  async delete(
    userId: string,
    token: string,
  ): Promise<{ ok?: number; n?: number }> {
    return this.tokenModel.deleteOne({ userId, token });
  }

  async deleteAll(userId: string): Promise<{ ok?: number; n?: number }> {
    return this.tokenModel.deleteMany({ userId });
  }

  async exists(userId: string, token: string): Promise<boolean> {
    return await this.tokenModel.exists({ userId, token });
  }

  async getUserId(token: string): Promise<string> {
    return await this.tokenModel
      .findOne({ token })
      .exec()
      .then(token => {
        if (!this.tokenActive(token.expireAt)) throw new ForbiddenException();
        return token.userId;
      })
      .catch(error => {
        if (error.status === 403)
          throw new ForbiddenException('Token is expired');
        throw new NotFoundException('Token not found');
      });
  }

  tokenActive(expireAt: string): boolean {
    return new Date(expireAt) > new Date(Date.now());
  }
}
