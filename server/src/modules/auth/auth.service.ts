import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User as UserModel } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  // Register new user
  async signup(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName?: string;
  }): Promise<UserModel> {
    const { email, password, firstName, lastName, displayName } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      displayName,
    });
  }
}
