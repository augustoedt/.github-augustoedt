import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostModel | null> {
    return this.postService.post({ id });
  }

  @Get('all')
  async getPosts(): Promise<PostModel[]> {
    return this.postService.posts({});
  }

  @Post('create')
  async createPost(): Promise<PostModel> {
    return this.postService.createPost({});
  }

  @Delete(':postid')
  async deletePost(@Param('postid') postid: string): Promise<PostModel> {
    return this.postService.deletePost({ where: { id: postid } });
  }
}
