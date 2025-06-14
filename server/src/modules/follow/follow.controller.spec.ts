import { Test, TestingModule } from '@nestjs/testing';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { UserPayload } from 'src/@types/user-payload';
import { Follow } from '@prisma/client';

describe('FollowController', () => {
  let controller: FollowController;

  const mockUser: UserPayload = {
    id: 'user-id-1',
    email: 'test@email.com',
  };

  const mockFollow: Follow = {
    id: 'follow-id-1',
    followerId: 'user-id-1',
    followingId: 'user-id-2',
  };

  const mockFollowService = {
    createFollow: jest.fn().mockResolvedValue(mockFollow),
    getFollowers: jest.fn().mockResolvedValue([mockFollow]),
    getFollowing: jest.fn().mockResolvedValue([mockFollow]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [
        {
          provide: FollowService,
          useValue: mockFollowService,
        },
      ],
    }).compile();

    controller = module.get<FollowController>(FollowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('followUser', () => {
    it('should follow a user', async () => {
      const result = await controller.followUser('user-id-2', mockUser);
      expect(mockFollowService.createFollow).toHaveBeenCalledWith({
        followerId: mockUser.id,
        followingId: 'user-id-2',
      });
      expect(result).toEqual(mockFollow);
    });
  });

  describe('getFollowers', () => {
    it('should return list of followers', async () => {
      const result = await controller.getFollowers(mockUser);
      expect(mockFollowService.getFollowers).toHaveBeenCalledWith({
        followingId: mockUser.id,
      });
      expect(result).toEqual([mockFollow]);
    });
  });

  describe('getFollowing', () => {
    it('should return list of following', async () => {
      const result = await controller.getFollowing(mockUser);
      expect(mockFollowService.getFollowing).toHaveBeenCalledWith({
        followerId: mockUser.id,
      });
      expect(result).toEqual([mockFollow]);
    });
  });
});
