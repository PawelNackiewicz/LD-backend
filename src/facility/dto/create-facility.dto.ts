import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFacilityDto {
  @ApiProperty({ description: 'The name of a facility.' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'The administration id of facility' })
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty({ description: 'The street name of a facility' })
  @IsString()
  @IsOptional()
  readonly streetName: string;

  @ApiProperty({ description: 'The house number of a facility' })
  @IsString()
  @IsOptional()
  readonly houseNumber: string;

  @ApiProperty({ description: 'The flat number of a facility' })
  @IsString()
  @IsOptional()
  readonly flatNumber: string;

  @ApiProperty({ description: 'The city of a facility' })
  @IsString()
  @IsOptional()
  readonly city: string;

  @ApiProperty({ description: 'The postcode of a facility' })
  @IsString()
  @IsOptional()
  readonly postcode: string;

  @ApiProperty({ description: 'The phone of a facility.' })
  @IsString()
  @IsOptional()
  readonly phone: string;

  @ApiProperty({ description: 'The description of a facility.' })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ description: 'The longitude of a facility' })
  @IsNumber()
  @IsOptional()
  readonly longitude: number;

  @ApiProperty({ description: 'The latitude of a facility' })
  @IsNumber()
  @IsOptional()
  readonly latitude: number;

  @ApiProperty({ description: 'The logo path of a facility.' })
  @IsString()
  @IsOptional()
  readonly logoPath: string;

  @ApiProperty({ description: 'The background image path of a facility.' })
  @IsString()
  @IsOptional()
  readonly backgroundImagePath: string;

  @ApiProperty({ description: 'The facebook url of a facility.' })
  @IsString()
  @IsOptional()
  readonly facebook: string;

  @ApiProperty({ description: 'The website url of a facility.' })
  @IsString()
  @IsOptional()
  readonly website: string;
}
