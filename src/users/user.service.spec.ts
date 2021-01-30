import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { DocumentQuery, Model } from 'mongoose';
import { IUser, UserProps } from './interfaces/user.interface';
import { createMock } from '@golevelup/nestjs-testing';

import { roleEnum } from './enums/role';
import { statusEnum } from './enums/status';
import { CreateUserDto } from './dto/create-user.dto';
import * as faker from 'faker';

type MockedUser = { _id: string } & UserProps;

const mockUserDto: CreateUserDto = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email:  faker.internet.email(),
  password: faker.internet.password()
};

const mockUser: MockedUser = {
  ...mockUserDto,
  password: faker.internet.password(),
  _id: faker.random.uuid(),
  status: statusEnum.pending,
  roles: [roleEnum.user],
  marketingPermissions: true,
};

const mockUpdatedUser: MockedUser = {
  ...mockUser,
  status: statusEnum.active,
  firstName: faker.name.firstName(),
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
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      }),
    );
    const foundUser = await service.find(mockUser._id);
    expect(foundUser).toEqual(mockUser);
  });

  it('should return the user object by email', async () => {
    jest.spyOn(userModel, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<IUser, IUser, unknown>>({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      }),
    );
    const foundUser = await service.findByEmail(mockUser.email);
    expect(foundUser).toEqual(mockUser);
  });

  it('should insert a new user', async () => {
    jest.spyOn(userModel, 'create').mockResolvedValueOnce(mockUser as IUser);
    jest
      .spyOn(service, 'hashPassword')
      .mockImplementation((password: string) =>
        Promise.resolve(password.concat('_###')),
      );
    const newUser = await service.create(mockUserDto, [roleEnum.user]);
    expect(newUser).toEqual(mockUser);
  });

  it('should update a user successfully', async () => {
    jest.spyOn(userModel, 'updateOne').mockResolvedValueOnce(mockUpdatedUser);
    const updatedUser = await service.update(mockUpdatedUser._id, {
      firstName: mockUpdatedUser.firstName,
      status: mockUpdatedUser.status,
    });
    expect(updatedUser).toEqual(mockUpdatedUser);
  });
});
