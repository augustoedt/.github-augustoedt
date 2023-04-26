import { Test, TestingModule } from '@nestjs/testing';
import { Comment, Post, User } from '@prisma/client';
import { commentFactory, userFactory } from '../../database/factories';
import { PrismaService } from '../prisma/prisma.service';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

describe('CommentController', () => {
  let commentController: CommentController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [PrismaService, CommentService],
    }).compile();

    commentController = app.get<CommentController>(CommentController);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.comment.deleteMany({});
    await prismaService.user.deleteMany({});
    await prismaService.post.deleteMany({});
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('create comment', () => {
    it('should create a new comment', async () => {
      const postData = commentFactory();
      const createdPost: Post = await prismaService.post.create({ data: {} });
      const createdUser: User = await prismaService.user.create({
        data: userFactory(),
      });

      const createdComment: Comment | null =
        await commentController.createComment(
          createdPost.id,
          createdUser.id,
          postData,
        );

      expect(createdComment).toHaveProperty('id');
      expect(createdComment?.content).toEqual(postData.content);
      expect(createdComment?.postId).toEqual(createdPost.id);
      expect(createdComment?.userId).toEqual(createdUser.id);
    });
  });

  describe('get comments by post id', () => {
    it('should return a list of comments for the given post id', async () => {
      const createdPost: Post = await prismaService.post.create({ data: {} });
      const createdUser: User = await prismaService.user.create({
        data: userFactory(),
      });
      const createdComment1: Comment = await prismaService.comment.create({
        data: {
          ...commentFactory(),
          postId: createdPost.id,
          userId: createdUser.id,
        },
      });
      const createdComment2: Comment = await prismaService.comment.create({
        data: {
          ...commentFactory(),
          postId: createdPost.id,
          userId: createdUser.id,
        },
      });

      const fetchedComments: Comment[] = await commentController.getComments(
        createdPost.id,
      );

      expect(fetchedComments.length).toEqual(2);
      expect(fetchedComments[0]).toHaveProperty('id');
      expect(fetchedComments[0].id).toEqual(createdComment1.id);
      expect(fetchedComments[0].content).toEqual(createdComment1.content);
      expect(fetchedComments[0].postId).toEqual(createdComment1.postId);
      expect(fetchedComments[0].userId).toEqual(createdComment1.userId);
      expect(fetchedComments[1]).toHaveProperty('id');
      expect(fetchedComments[1].id).toEqual(createdComment2.id);
      expect(fetchedComments[1].content).toEqual(createdComment2.content);
      expect(fetchedComments[1].postId).toEqual(createdComment2.postId);
      expect(fetchedComments[1].userId).toEqual(createdComment2.userId);
    });
  });

  describe('delete comment by id and user id', () => {
    it('should delete the correct comment', async () => {
      const createdPost: Post = await prismaService.post.create({ data: {} });
      const createdUser: User = await prismaService.user.create({
        data: userFactory(),
      });
      const createdComment: Comment = await prismaService.comment.create({
        data: {
          ...commentFactory(),
          postId: createdPost.id,
          userId: createdUser.id,
        },
      });

      const deletedComment: Comment | null =
        await commentController.deleteComment(
          createdUser.id,
          createdComment.id,
        );
      expect(deletedComment).toHaveProperty('id');
      expect(deletedComment?.id).toEqual(createdComment.id);

      const fetchedComment: Comment | null =
        await prismaService.comment.findUnique({
          where: { id: createdComment.id },
        });
      expect(fetchedComment).toBeNull();
    });

    it('should not delete a comment if the user id is incorrect', async () => {
      const createdPost: Post = await prismaService.post.create({ data: {} });
      const createdUser1: User = await prismaService.user.create({
        data: userFactory(),
      });
      const createdUser2: User = await prismaService.user.create({
        data: userFactory(),
      });
      const createdComment: Comment = await prismaService.comment.create({
        data: {
          ...commentFactory(),
          postId: createdPost.id,
          userId: createdUser1.id,
        },
      });

      const deletedComment: Comment | null =
        await commentController.deleteComment(
          createdUser2.id,
          createdComment.id,
        );

      expect(deletedComment).toBeNull();

      const fetchedComment: Comment | null =
        await prismaService.comment.findUnique({
          where: { id: createdComment.id },
        });
      expect(fetchedComment).not.toBeNull();
    });
  });

  describe('edit comment by id and user id', () => {
    it('should edit the correct comment', async () => {
      const postData = commentFactory();
      const createdPost: Post = await prismaService.post.create({ data: {} });
      const createdUser: User = await prismaService.user.create({
        data: userFactory(),
      });
      const createdComment: Comment = await prismaService.comment.create({
        data: {
          ...commentFactory(),
          postId: createdPost.id,
          userId: createdUser.id,
        },
      });

      const editedComment: Comment | null = await commentController.editComment(
        createdUser.id,
        createdComment.id,
        postData,
      );

      expect(editedComment).toHaveProperty('id');
      expect(editedComment?.id).toEqual(createdComment.id);
      expect(editedComment?.content).toEqual(postData.content);

      const fetchedComment: Comment | null =
        await prismaService.comment.findUnique({
          where: { id: createdComment.id },
        });
      expect(fetchedComment).not.toBeNull();
      expect(fetchedComment?.content).toEqual(postData.content);
    });

    it('should not edit a comment if the user id is incorrect', async () => {
      const postData = commentFactory();
      const createdPost: Post = await prismaService.post.create({ data: {} });
      const createdUser1: User = await prismaService.user.create({
        data: userFactory(),
      });
      const createdUser2: User = await prismaService.user.create({
        data: userFactory(),
      });
      const createdComment: Comment = await prismaService.comment.create({
        data: {
          ...commentFactory(),
          postId: createdPost.id,
          userId: createdUser1.id,
        },
      });

      const editedComment: Comment | null = await commentController.editComment(
        createdUser2.id,
        createdComment.id,
        postData,
      );

      expect(editedComment).toBeNull();

      const fetchedComment: Comment | null =
        await prismaService.comment.findUnique({
          where: { id: createdComment.id },
        });
      expect(fetchedComment).not.toBeNull();
      expect(fetchedComment?.content).toEqual(createdComment.content);
    });
  });
});
