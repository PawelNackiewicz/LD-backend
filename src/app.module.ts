import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilityModule } from './facility/facility.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule.register({ folder: './config' }),
    AuthModule,
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    FacilityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
