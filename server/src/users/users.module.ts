import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelFactory } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeatureAsync([UserModelFactory])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
