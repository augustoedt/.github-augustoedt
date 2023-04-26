import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Comment as CommentModel } from '@prisma/client';
import { CommentService } from './comment.service';

@Controller('post')
export class CommentController {
  constructor(private commentService: CommentService) {}

  // ************
  // Task 1
  // ************
  // usuário deve ser capaz de criar um comentário.
  @Post('post/:postid/comment/:userid')
  async createComment(
    @Param('postid') postid: string,
    @Param('userid') userid: string,
    @Body() postData: { content: string },
  ): Promise<CommentModel | null> {
    return this.commentService.createComment({
      content: postData.content,
      post: { connect: { id: postid } },
      user: { connect: { id: userid } },
    });
  }

  // ************
  // Task 2
  // ************
  // usuário deve ser capaz de ler todos os comentários.
  @Get('post/:postid/comments')
  async getComments(@Param('postid') postid: string): Promise<CommentModel[]> {
    return this.commentService.comments({
      where: { postId: postid },
    });
  }

  // ************
  // Task 3
  // ************
  // usuário deve ser capaz de excluir seu próprio comentário.
  @Delete('post/comment/:commentid/:userid')
  async deleteComment(
    @Param('userid') userid: string,
    @Param('commentid') commentid: string,
  ): Promise<CommentModel | null> {
    const comment = await this.commentService.comment({ id: commentid });
    if (comment && comment.userId == userid) {
      return this.commentService.deleteComment({ id: commentid });
    }
    return null;
  }

  // ************
  // Task 4
  // ************
  // usuário deve ser capaz de editar seu próprio comentário.
  @Put('post/comment/:commentid/:userid/edit')
  async editComment(
    @Param('userid') userid: string,
    @Param('commentid') commentid: string,
    @Body() postData: { content: string },
  ): Promise<CommentModel | null> {
    const comment = await this.commentService.comment({ id: commentid });
    if (comment && comment.userId == userid) {
      return this.commentService.updateComment({
        where: { id: commentid },
        data: { content: postData.content },
      });
    }
    return null;
  }
}
