import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilityModule } from './facility/facility.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    FacilityModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}