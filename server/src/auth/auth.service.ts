import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);

    console.log(user);
    const isPasswordValid = await user?.comparePassword(password);

    if (user && isPasswordValid) {
      return user;
    }

    return null;
  }

  async generateAccessToken(user: any): Promise<string> {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return this.jwtService.sign(jwtPayload);
  }
}
