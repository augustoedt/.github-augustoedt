import { Test, TestingModule } from '@nestjs/testing';
import { Post } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let postController: PostController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PrismaService, PostService],
    }).compile();

    postController = app.get<PostController>(PostController);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.post.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('create blog post', () => {
    it('should create a new blog post', async () => {
      const createdPost: Post = await postController.createPost();

      expect(createdPost).toHaveProperty('id');
    });
  });

  describe('get blog post by id', () => {
    it('should return the correct blog post', async () => {
      const createdPost: Post = await postController.createPost();

      const fetchedPost: Post | null = await postController.getPostById(
        createdPost.id,
      );

      expect(fetchedPost).toHaveProperty('id');
      expect(fetchedPost?.id).toEqual(createdPost.id);
    });
  });
});
