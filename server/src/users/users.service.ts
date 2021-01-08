import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  async register(username: string, password: string): Promise<User> {
    const isPresent = await this.findOneByUsername(username);

    if (isPresent) {
      throw new ConflictException('username already taken');
    }

    return await this.userModel.create({ username, password });
  }
}
