import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { Model } from 'mongoose';
import { IUserToken } from './interfaces/user-token.interface';
import { getModelToken } from '@nestjs/mongoose';
import { createMock } from '@golevelup/nestjs-testing';

describe('ToeknService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: getModelToken('Token'),
          useValue: createMock<Model<IUserToken>>(),
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
