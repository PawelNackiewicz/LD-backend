import { Test, TestingModule } from '@nestjs/testing';
import { FacilityService } from './facility.service';
import { DocumentQuery, Model, Types} from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { createMock } from '@golevelup/nestjs-testing';
import { FacilityProps, IFacility } from './interfaces/facility.interface';
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

type MockedFacility = { _id: string } & FacilityProps;

const mockUserId = Date.now();

const mockFacilityDto: CreateFacilityDto = {
  name: 'Facilit mock name',
  userId: mockUserId.toString(),
  streetName: 'Facilit mock street name',
  description: 'desc',
  phone: '123',
  city: 'city',
  flatNumber: '',
  houseNumber: '',
  latitude: 0,
  longitude: 0,
  postcode: '123-AB',
};

const mockFacility: MockedFacility = {
  ...mockFacilityDto,
  _id: 'abc123',
};

const mockFacilities: MockedFacility[] = [
  {
    ...mockFacilityDto,
    _id: 'abc123'
  },
  {
    ...mockFacilityDto,
    _id: 'yzn123'
  }
]

const mockUpdatedFacility: MockedFacility = {
  ...mockFacility,
  name: 'Edited facility'
}

describe('FacilityService', () => {
  let facilityService: FacilityService;
  let authService: AuthService;
  let tokenService: TokenService;
  let facilityModel: Model<IFacility>;

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
          useValue: createMock<Model<IFacility>>(),
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
    facilityModel = module.get<Model<IFacility>>(getModelToken('Facility'));
  });

  it('should be defined', () => {
    expect(facilityService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the facility object by ID', async () => {
    jest.spyOn(facilityModel, 'findById').mockReturnValueOnce(
      createMock<DocumentQuery<IFacility, IFacility, unknown>>({
        exec: jest.fn().mockResolvedValueOnce(mockFacility),
      }),
    );
    const foundedFacility = await facilityService.find(mockFacility._id);
    expect(foundedFacility).toEqual(mockFacility);
  });

  it('should return all user facilities', async () => {
    jest.spyOn(facilityModel, 'find').mockReturnValueOnce(
      createMock<DocumentQuery<IFacility[], IFacility, unknown>>({
        exec: jest.fn().mockResolvedValueOnce(mockFacilities),
      }),
    );
    const foundedFacility = await facilityService.findAllByUser(mockUserId.toString());
    expect(foundedFacility).toEqual(mockFacilities);
  });

  it('should insert a new facility', async () => {
    jest.spyOn(facilityModel, 'create').mockResolvedValueOnce(mockFacility as IFacility);
    const newFacility = await facilityService.create(mockFacilityDto);
    expect(newFacility).toEqual(mockFacility)
  })

  it('should update a facility successfully', async () => {
    jest.spyOn(facilityModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedFacility as IFacility);
    jest.spyOn(tokenService, 'getUserId').mockResolvedValueOnce(Types.ObjectId.createFromTime(mockUserId));
    jest.spyOn(authService, 'getUserInfo').mockResolvedValueOnce({
      _id: mockUserId.toString(),
      email: 'email@example.com',
      status: 'active',
      lastName: 'lastName',
      firstName: 'firstName',
      roles: [roleEnum.user]
    });
    jest.spyOn(facilityModel, 'findById').mockResolvedValueOnce(mockUpdatedFacility as IFacility);
    const updatedFacility = await facilityService.update(mockUpdatedFacility._id, {
      name: mockUpdatedFacility.name
    }, 'token');
    expect(updatedFacility).toEqual(mockUpdatedFacility)
  })
});
