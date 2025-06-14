import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { NotFoundException } from '@nestjs/common';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  const mockPost = {
    id: 'post-id-1',
    title: 'Test Post',
    content: 'This is a test',
    audioUrl: 'https://www.test.com/audio.mp3',
    authorId: 'user-id-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 'user-id1',
    email: 'test@email.com',
  };

  const mockPostService = {
    createPost: jest.fn().mockResolvedValue(mockPost),
    posts: jest.fn().mockResolvedValue([mockPost]),
    post: jest.fn().mockResolvedValue(mockPost),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });

  describe('createPost', () => {
    it('should create and return a post', async () => {
      const createPostDto: CreatePostDto = {
        content: 'Content of the new post',
      };

      const result = await postController.createPost(createPostDto, mockUser);
      jest
        .spyOn(postService, 'createPost')
        .mockImplementation(() => Promise.resolve(mockPost));

      // Assertions
      expect(postService.createPost).toHaveBeenCalledWith({
        ...createPostDto,
        authorId: mockUser.id,
      });
      expect(postService.createPost).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockPost);
    });
  });

  describe('getPosts', () => {
    it('should return all posts', async () => {
      const result = await postController.getPosts(0, 10);
      // Assertions
      expect(postService.posts).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual([mockPost]);
    });
  });

  describe('getUserPosts', () => {
    it('should return posts for current user', async () => {
      const result = await postController.getUserPosts(mockUser, 0, 10);
      expect(postService.posts).toHaveBeenCalledWith({
        where: { authorId: mockUser.id },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual([mockPost]);
    });
  });

  describe('getPost', () => {
    it('should return a post by id', async () => {
      const result = await postController.getPost('post-id-1');
      expect(postService.post).toHaveBeenCalledWith({ id: 'post-id-1' });
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(postService, 'post').mockResolvedValueOnce(null);
      await expect(postController.getPost('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
