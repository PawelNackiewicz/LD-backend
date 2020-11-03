import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { DocumentQuery, Model } from 'mongoose';
import { IUser, UserProps } from './interfaces/user.interface';
import { createMock } from '@golevelup/nestjs-testing';

import { roleEnum } from './enums/role.enums';
import { statusEnum } from './enums/status.enums';

type MockedUser = { _id: string } & UserProps

const mockUser: MockedUser = {
  email: 'test@gmail.com',
  _id: 'abc123',
  status: statusEnum.pending,
  lastName: 'lastName',
  firstName: 'firstName',
  roles: [roleEnum.user],
  password: 'pass123#',
  marketingPermissions: true,
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<IUser>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: createMock<Model<IUser>>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<IUser>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the user object by ID', async () => {
    jest.spyOn(userModel, 'findById').mockReturnValueOnce(
      createMock<DocumentQuery<IUser, IUser, unknown>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(mockUser),
      }),
    );
    const findMockUser = mockUser;
    const foundUser = await service.find('abc123');
    expect(foundUser).toEqual(findMockUser);
  });

  it('should return the user object by email', async () => {
    jest.spyOn(userModel, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<IUser, IUser, unknown>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(mockUser),
      }),
    );
    const findMockUser = mockUser;
    const foundUser = await service.findByEmail(mockUser.email);
    expect(foundUser).toEqual(findMockUser);
  });

  it('should insert a new user', async () => {
    jest.spyOn(userModel, 'create').mockResolvedValueOnce({
        _id: 'abc123',
        roles: [roleEnum.user],
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'test@gmail.com',
        password: 'pass123#',
        marketingPermissions: true,
        status: statusEnum.pending
      } as any
    );
    const newUser = await service.create({
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'test@gmail.com',
      password: 'pass123#',
    }, [roleEnum.user]);
    expect(newUser).toEqual(mockUser);
  });
});
