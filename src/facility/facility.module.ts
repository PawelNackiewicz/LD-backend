import { Module } from '@nestjs/common';
import { FacilityController } from './controller/facility.controller';
import { FacilityService } from './service/facility.service';
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
