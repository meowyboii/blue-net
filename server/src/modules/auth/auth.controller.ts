import { Body, Controller, Post, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User as UserModel } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);
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
    this.logger.log('Received signup request', userData);
    return this.authService.signup(userData);
  }
}
