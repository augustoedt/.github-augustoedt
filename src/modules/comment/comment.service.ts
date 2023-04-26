import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async comment(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
  ): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: commentWhereUniqueInput,
    });
  }

  async comments(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWhereUniqueInput;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }): Promise<Comment[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.comment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createComment(data: Prisma.CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({
      data,
    });
  }

  async updateComment(data: Prisma.CommentUpdateArgs): Promise<Comment> {
    return this.prisma.comment.update({
      where: data.where,
      data: data.data,
      include: data.include,
    });
  }

  async deleteComment(where: Prisma.CommentWhereUniqueInput): Promise<Comment> {
    return this.prisma.comment.delete({
      where,
    });
  }
}
