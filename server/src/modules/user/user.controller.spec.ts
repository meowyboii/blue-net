import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserPayload } from 'src/@types/user-payload';

describe('UserController', () => {
  let userController: UserController;

  const mockUser: UserPayload = {
    id: 'user-id-1',
    email: 'test@example.com',
  };

  const mockUserService = {
    getUsersNotFollowedBy: jest.fn(),
    user: jest.fn(),
    updateUser: jest.fn(),
    uploadAvatar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getSuggestedUsers', () => {
    it('should return users not followed by the current user', async () => {
      const mockUsers = [{ id: 'user2' }, { id: 'user3' }];
      mockUserService.getUsersNotFollowedBy.mockResolvedValue(mockUsers);

      const result = await userController.getSuggestedUsers(mockUser);
      expect(result).toEqual(mockUsers);
      expect(mockUserService.getUsersNotFollowedBy).toHaveBeenCalledWith(
        'user-id-1',
      );
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile with counts', async () => {
      const mockProfile = {
        id: 'user-id-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        displayName: 'testuser',
        bio: 'This is a bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: new Date(),
      };

      mockUserService.user.mockResolvedValue(mockProfile);

      const result = await userController.getUserProfile(mockUser);
      expect(result).toEqual(mockProfile);
      expect(mockUserService.user).toHaveBeenCalledWith(
        { id: 'user-id-1' },
        expect.objectContaining({
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
        }),
      );
    });
  });

  describe('updateUserProfile', () => {
    it('should update profile without avatar', async () => {
      const dto = {
        displayName: 'Updated User',
        bio: 'Updated bio',
      };

      const updatedUser = {
        ...mockUser,
        firstName: 'Test',
        lastName: 'User',
        displayName: dto.displayName,
        bio: dto.bio,
        avatarUrl: null,
        createdAt: new Date(),
      };

      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const result = await userController.updateUserProfile(mockUser, dto);
      expect(result).toEqual(updatedUser);
      expect(mockUserService.updateUser).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
        data: {
          displayName: dto.displayName,
          bio: dto.bio,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
        },
      });
    });

    it('should update profile with avatar', async () => {
      const dto = {
        displayName: 'Updated User',
        bio: 'Updated bio',
      };

      const mockFile = {
        buffer: Buffer.from('file content'),
        originalname: 'avatar.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const avatarUrl = 'https://cdn.example.com/avatar.jpg';

      const updatedUser = {
        ...mockUser,
        firstName: 'Test',
        lastName: 'User',
        displayName: dto.displayName,
        bio: dto.bio,
        avatarUrl,
        createdAt: new Date(),
      };

      mockUserService.uploadAvatar.mockResolvedValue(avatarUrl);
      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const result = await userController.updateUserProfile(
        mockUser,
        dto,
        mockFile,
      );
      expect(mockUserService.uploadAvatar).toHaveBeenCalledWith(
        mockFile,
        'user-id-1',
      );
      expect(result).toEqual(updatedUser);
    });
  });
});
