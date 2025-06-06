import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User as UserModel } from '@prisma/client';
import { UserWithCounts } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  // Register new user
  // This method hashes the password and creates a new user in the database
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
  // Validate user credentials
  // This method checks if the user exists and if the password is correct
  async validateUser(email: string, password: string): Promise<UserWithCounts> {
    const user = await this.userService.user({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  // Login user
  // This method generates a JWT token for the user after successful login
  async login(user: UserWithCounts): Promise<{ access_token: string }> {
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
