import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User as UserModel } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserPayload } from 'src/@types/user-payload';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async signup(
    @Body()
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      displayName?: string;
    },
  ): Promise<UserModel> {
    return this.authService.signup(userData);
  }
  @Post('login')
  async login(
    @Body()
    userData: {
      email: string;
      password: string;
    },
  ): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(
      userData.email,
      userData.password,
    );

    // If the user is valid, generate a JWT token
    const token = this.authService.login(user);
    return token;
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@CurrentUser() user: UserPayload) {
    return user; // Contains userId and email from JwtStrategy
  }
}
