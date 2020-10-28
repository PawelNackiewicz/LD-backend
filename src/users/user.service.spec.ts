import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { DocumentQuery, Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { createMock } from '@golevelup/nestjs-testing';

import { roleEnum } from './enums/role.enums';

const mockUser: (email?: string, _id?: string, status?: string, lastName?: string, firstName?: string, roles?: roleEnum[], password?: string, marketingPermissions?: boolean) => { firstName: string; lastName: string; password: string; roles: roleEnum[]; _id: string; email: string; status: string; marketingPermissions: boolean } = (
  email = 'test@gmail.com',
  _id = 'abc123',
  status = 'active',
  lastName = 'wel',
  firstName = 'Pa',
  roles = [roleEnum.user],
  password = 'pass123#',
  marketingPermissions = true,
) => {
  return {
    email,
    _id,
    status,
    password,
    firstName,
    lastName,
    roles,
    marketingPermissions,
  };
};

const mockUserDoc: (mock?: {
  email?: string;
  id?: string;
  status?: string;
  lastName?: string;
  firstName?: string;
  roles?: Array<string>;
  password?: string;
  marketingPermissions?: boolean
}) => Partial<IUser> = (mock?: {
  email?: string;
  id?: string;
  status?: string;
  lastName?: string;
  firstName?: string;
  roles?: roleEnum[];
  password?: string;
  marketingPermissions?: boolean
}) => {
  return {
    email: (mock && mock.email) || 'pawi@gmail.com',
    _id: (mock && mock.id) || 'a uuid',
    status: (mock && mock.status) || 'active',
    lastName: (mock && mock.lastName) || 'Pawi',
    firstName: (mock && mock.firstName) || 'Pawel',
    roles: (mock && mock.roles) || [roleEnum.user],
    password: (mock && mock.password) || 'password123!',
    marketingPermissions: (mock && mock.marketingPermissions) || true,
  };
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
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findById: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<IUser>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when user with ID exist', () => {
      it('should return the user object', async () => {
        jest.spyOn(userModel, 'findById').mockReturnValueOnce(
          createMock<DocumentQuery<IUser, IUser, unknown>>({
            exec: jest
              .fn()
              .mockResolvedValueOnce(mockUserDoc({
                email: 'test@gmail.com',
                id: 'abc123',
                status: 'active',
                password: 'pass123#',
                firstName: 'Pa',
                lastName: 'wel',
                roles: [roleEnum.user],
                marketingPermissions: true,
              })),
          }),
        );
        const findMockUser = mockUser('test@gmail.com', 'abc123', 'active', 'wel', 'Pa', [roleEnum.user], 'pass123#', true);
        const foundUser = await service.find('abc123');
        expect(foundUser).toEqual(findMockUser);
      });
    });
  });
});
