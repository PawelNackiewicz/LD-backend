import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { Model } from 'mongoose';
import { IUserToken, TokenProps } from './interfaces/user-token.interface';
import { getModelToken } from '@nestjs/mongoose';
import { createMock } from '@golevelup/nestjs-testing';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import * as mongoose from 'mongoose';

type MokedToken = { _id: string } & TokenProps

const mockObjectId = new mongoose.Types.ObjectId();

const mockTokenDto: CreateUserTokenDto = {
  token: 'a172c98424ad6c6269d398de476940e29feacea5f8ab270ecbc45262ec1d6f04a4abd223925bb0759e915f96c7aaf196',
  userId: mockObjectId,
  expireAt: '2020-11-04T21:06:26.236Z',
}

const mockToken: MokedToken = {
  ...mockTokenDto,
  _id: '5fa1c652ae2ac23e9c465116',
}

describe('ToeknService', () => {
  let service: TokenService;
  // let tokenModel: Model<IUserToken>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: getModelToken('Token'),
          useValue: createMock<Model<IUserToken>>()
        }
      ]
    }).compile()

    service = module.get<TokenService>(TokenService);
    // tokenModel = module.get<Model<IUserToken>>(getModelToken('Token'))
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sholud create a token', async () => {
    jest.spyOn(service, 'create').mockResolvedValueOnce(mockToken as IUserToken);
    const newToken = await service.create(mockTokenDto);
    expect(mockToken).toEqual(newToken)
  })
})
