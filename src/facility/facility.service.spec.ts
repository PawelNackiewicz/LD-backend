import { Test, TestingModule } from '@nestjs/testing';
import { FacilityService } from './facility.service';
import { DocumentQuery, Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { createMock } from '@golevelup/nestjs-testing';
import { FacilityProps, Facility } from './interfaces/facility.interface';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '../config/config.service';
import { TokenService } from '../token/token.service';
import { IUser } from '../users/interfaces/user.interface';
import { CONFIG_OPTIONS } from '../config/constants';
import { IUserToken } from '../token/interfaces/user-token.interface';
import { roleEnum } from '../users/enums/role';
import * as faker from 'faker';

type MockedFacility = { _id: string } & FacilityProps;

const mockUserId = faker.random.uuid();

const mockFacilityDto: CreateFacilityDto = {
  name: faker.company.companyName(),
  userId: mockUserId,
  streetName: faker.address.streetName(),
  description: faker.lorem.text(),
  phone: faker.phone.phoneNumber(),
  city: faker.address.city(),
  flatNumber: faker.address.streetPrefix(),
  houseNumber: faker.address.streetSuffix(),
  latitude: Number(faker.address.latitude),
  longitude: Number(faker.address.longitude),
  postcode: faker.address.zipCode(),
};

const mockFacility: MockedFacility = {
  ...mockFacilityDto,
  _id: faker.random.uuid(),
};

const mockFacilities: MockedFacility[] = [
  {
    ...mockFacilityDto,
    _id: faker.random.uuid()
  },
  {
    ...mockFacilityDto,
    _id: faker.random.uuid()
  }
]

const mockUpdatedFacility: MockedFacility = {
  ...mockFacility,
  name: faker.company.companyName()
}

describe('FacilityService', () => {
  let facilityService: FacilityService;
  let authService: AuthService;
  let tokenService: TokenService;
  let facilityModel: Model<Facility>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacilityService,
        AuthService,
        UserService,
        MailService,
        ConfigService,
        TokenService,
        {
          provide: getModelToken('Facility'),
          useValue: createMock<Model<Facility>>(),
        },
        {
          provide: getModelToken('User'),
          useValue: createMock<Model<IUser>>(),
        },
        {
          provide: getModelToken('Token'),
          useValue: createMock<Model<IUserToken>>(),
        },
        {
          provide: CONFIG_OPTIONS,
          useValue: { folder: './config' },
        },
      ],
    }).compile();

    facilityService = module.get<FacilityService>(FacilityService);
    authService = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
    facilityModel = module.get<Model<Facility>>(getModelToken('Facility'));
  });

  it('should be defined', () => {
    expect(facilityService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the facility object by ID', async () => {
    jest.spyOn(facilityModel, 'findById').mockReturnValueOnce(
      createMock<DocumentQuery<Facility, Facility, unknown>>({
        exec: jest.fn().mockResolvedValueOnce(mockFacility),
      }),
    );
    const foundedFacility = await facilityService.find(mockFacility._id);
    expect(foundedFacility).toEqual(mockFacility);
  });

  it('should return all user facilities', async () => {
    jest.spyOn(facilityModel, 'find').mockReturnValueOnce(
      createMock<DocumentQuery<Facility[], Facility, unknown>>({
        exec: jest.fn().mockResolvedValueOnce(mockFacilities),
      }),
    );
    const foundedFacility = await facilityService.findAllByUser(mockUserId.toString());
    expect(foundedFacility).toEqual(mockFacilities);
  });

  it('should insert a new facility', async () => {
    jest.spyOn(facilityModel, 'create').mockResolvedValueOnce(mockFacility as Facility);
    const newFacility = await facilityService.create(mockFacilityDto);
    expect(newFacility).toEqual(mockFacility)
  })

  it('should update a facility successfully', async () => {
    jest.spyOn(facilityModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedFacility as Facility);
    jest.spyOn(tokenService, 'getUserId').mockResolvedValueOnce(Types.ObjectId.createFromTime(Number(mockUserId)));
    jest.spyOn(authService, 'getUserInfo').mockResolvedValueOnce({
      _id: mockUserId,
      email: faker.internet.email(),
      status: faker.random.arrayElement(['active', 'inactive']),
      lastName: faker.name.firstName(),
      firstName: faker.name.lastName(),
      roles: faker.random.arrayElement([
        [roleEnum.admin, roleEnum.user],
        [roleEnum.admin],
        [roleEnum.user]
      ])
    });
    jest.spyOn(facilityModel, 'findById').mockResolvedValueOnce(mockUpdatedFacility as Facility);
    const updatedFacility = await facilityService.update(mockUpdatedFacility._id, {
      name: mockUpdatedFacility.name
    }, faker.random.word());
    expect(updatedFacility).toEqual(mockUpdatedFacility)
  })
  it('should delete a facility successfully', async () => {
    jest.spyOn(facilityModel, 'findByIdAndDelete').mockResolvedValueOnce(mockFacility as Facility);
    jest.spyOn(tokenService, 'getUserId').mockResolvedValueOnce(Types.ObjectId.createFromTime(Number(mockUserId)));
    jest.spyOn(authService, 'getUserInfo').mockResolvedValueOnce({
      _id: mockUserId,
      email: faker.internet.email(),
      status: faker.random.arrayElement(['active', 'inactive']),
      lastName: faker.name.firstName(),
      firstName: faker.name.lastName(),
      roles: faker.random.arrayElement([
        [roleEnum.admin, roleEnum.user],
        [roleEnum.admin],
        [roleEnum.user]
      ])
    });
    jest.spyOn(facilityModel, 'findById').mockResolvedValueOnce(mockFacility as Facility);
    const facilityToDelete = await facilityService.delete(mockFacility._id, faker.random.word());
    expect(facilityToDelete).toEqual(mockFacility);
  });
});
