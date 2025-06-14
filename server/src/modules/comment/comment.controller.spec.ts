import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment as CommentModel } from '@prisma/client';
import { UserPayload } from 'src/@types/user-payload';

describe('CommentController', () => {
  let controller: CommentController;

  const mockUser: UserPayload = {
    id: 'user-id-1',
    email: 'test@example.com',
  };

  const mockComment: CommentModel = {
    id: 'comment-id-1',
    content: 'Nice post!',
    postId: 'post-id-1',
    authorId: mockUser.id,
    createdAt: new Date(),
  };

  const mockCommentService = {
    createComment: jest.fn().mockResolvedValue(mockComment),
    getCommentsByPostId: jest.fn().mockResolvedValue([mockComment]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createComment', () => {
    it('should create and return a comment', async () => {
      const postId = 'post-id-1';
      const createCommentDto: CreateCommentDto = {
        content: 'Nice post!',
      };

      const result = await controller.createComment(
        postId,
        createCommentDto,
        mockUser,
      );

      expect(mockCommentService.createComment).toHaveBeenCalledWith({
        ...createCommentDto,
        postId,
        authorId: mockUser.id,
      });
      expect(result).toEqual(mockComment);
    });
  });

  describe('getComments', () => {
    it('should return comments for a post with default pagination', async () => {
      const postId = 'post-id-1';

      const result = await controller.getComments(postId, undefined, undefined);

      expect(mockCommentService.getCommentsByPostId).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 5,
        where: { postId },
      });
      expect(result).toEqual([mockComment]);
    });

    it('should return comments for a post with custom skip and take', async () => {
      const postId = 'post-id-1';

      const result = await controller.getComments(postId, '2', '10');

      expect(mockCommentService.getCommentsByPostId).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        skip: 2,
        take: 10,
        where: { postId },
      });
      expect(result).toEqual([mockComment]);
    });
  });
});
