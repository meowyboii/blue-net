import { Test, TestingModule } from '@nestjs/testing';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { Reaction as ReactionModel } from '@prisma/client';
import { UserPayload } from 'src/@types/user-payload';

describe('ReactionController', () => {
  let controller: ReactionController;

  const mockUser: UserPayload = {
    id: 'user-id-1',
    email: 'test@example.com',
  };

  const mockReaction: ReactionModel = {
    id: 'reaction-id-1',
    type: 'LIKE',
    userId: mockUser.id,
    postId: 'post-id-1',
    createdAt: new Date(),
  };

  const mockReactionCounts = {
    LIKE: 10,
    LOVE: 2,
    HAHA: 1,
  };

  const mockReactionService = {
    createReaction: jest.fn().mockResolvedValue(mockReaction),
    getReactionCounts: jest.fn().mockResolvedValue(mockReactionCounts),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionController],
      providers: [
        {
          provide: ReactionService,
          useValue: mockReactionService,
        },
      ],
    }).compile();

    controller = module.get<ReactionController>(ReactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReaction', () => {
    it('should create and return a reaction', async () => {
      const createReactionDto: CreateReactionDto = {
        userId: mockUser.id,
        type: 'LIKE',
        postId: 'post-id-1',
      };

      const result = await controller.createReaction(
        createReactionDto,
        mockUser,
      );

      expect(mockReactionService.createReaction).toHaveBeenCalledWith({
        ...createReactionDto,
        userId: mockUser.id,
      });
      expect(result).toEqual(mockReaction);
    });
  });

  describe('getReactionCounts', () => {
    it('should return reaction counts for a post', async () => {
      const postId = 'post-id-1';

      const result = await controller.getReactionCounts(postId);

      expect(mockReactionService.getReactionCounts).toHaveBeenCalledWith(
        postId,
      );
      expect(result).toEqual(mockReactionCounts);
    });
  });
});
