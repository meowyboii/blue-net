import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User as UserModel } from '@prisma/client';
import { UserPayload } from 'src/@types/user-payload';

describe('AuthController', () => {
  let controller: AuthController;

  const mockUser: UserModel = {
    id: 'user-id-1',
    email: 'test@example.com',
    password: 'hashedpassword',
    firstName: 'Test',
    lastName: 'User',
    displayName: 'Tester',
    bio: null,
    avatarUrl: 'https://example.com/avatar.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPayload: UserPayload = {
    id: mockUser.id,
    email: mockUser.email,
  };

  const mockAuthService = {
    signup: jest.fn().mockResolvedValue(mockUser),
    validateUser: jest.fn().mockResolvedValue(mockUser),
    login: jest.fn().mockReturnValue({ access_token: 'mock-token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should create and return a user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        displayName: undefined,
      };

      const result = await controller.signup(userData);
      expect(mockAuthService.signup).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should validate and return a JWT token', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await controller.login(userData);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        userData.email,
        userData.password,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ access_token: 'mock-token' });
    });
  });

  describe('getProfile', () => {
    it('should return the current user payload', () => {
      const result = controller.getProfile(mockPayload);
      expect(result).toEqual(mockPayload);
    });
  });
});
