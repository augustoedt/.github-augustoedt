import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CommentService } from './modules/comment/comment.service';
import { PostController } from './modules/post/post.controller';
import { PostService } from './modules/post/post.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { UserService } from './modules/user/user.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController, PostController],
      providers: [PrismaService, PostService, UserService, CommentService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('test server', () => {
    it('should return live status', async () => {
      expect(await appController.status()).toEqual({ status: 'live' });
    });
  });
});
