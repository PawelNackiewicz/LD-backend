import { ApiProperty } from '@nestjs/swagger';

export class CreateFacilityDto {
  @ApiProperty({ description: 'The name of a facility.' })
  readonly name: string;
  @ApiProperty({ description: 'The phone of a facility.' })
  readonly phone: string;
  @ApiProperty({ description: 'The description of a facility.' })
  readonly description: string;
}
