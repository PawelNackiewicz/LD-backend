import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilitySchema } from './schemas/facility.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Facility', schema: FacilitySchema }])],
  controllers: [FacilityController],
  providers: [FacilityService],
})
export class FacilityModule {}
