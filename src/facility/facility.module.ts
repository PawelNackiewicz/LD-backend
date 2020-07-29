import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Facility, FacilitySchema } from './schemas/facility.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Facility.name, schema: FacilitySchema },
    ]),
  ],
  controllers: [FacilityController],
  providers: [FacilityService],
})
export class FacilityModule {}
