import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommentController } from './modules/comment/comment.controller';
import { CommentService } from './modules/comment/comment.service';
import { PostController } from './modules/post/post.controller';
import { PostService } from './modules/post/post.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { UserService } from './modules/user/user.service';

@Module({
  imports: [],
  controllers: [AppController, PostController, CommentController],
  providers: [PrismaService, UserService, PostService, CommentService],
})
export class AppModule {}
