import { Module } from '@nestjs/common';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilitySchema } from './schemas/facility.schema';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Facility', schema: FacilitySchema }]),
    AuthModule,
    TokenModule
  ],
  controllers: [FacilityController],
  providers: [FacilityService],
})
export class FacilityModule {}
