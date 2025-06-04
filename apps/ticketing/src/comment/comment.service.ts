import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async addComment(ticketId: string, dto: CreateCommentDto, userId: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.ticketingComment.create({
      data: {
        content: dto.content,
        ticketId,
        userId,
      },
    });
  }

  async getComments(ticketId: string) {
    return this.prisma.ticketingComment.findMany({
      where: { ticketId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateComment(id: number, dto: UpdateCommentDto, userId: number) {
    const comment = await this.prisma.ticketingComment.findUnique({
      where: { id },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId)
      throw new ForbiddenException('Access denied');
    return this.prisma.ticketingComment.update({
      where: { id },
      data: { ...dto },
    });
  }

  async deleteComment(id: number, userId: number) {
    const comment = await this.prisma.ticketingComment.findUnique({
      where: { id },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId)
      throw new ForbiddenException('Access denied');
    return this.prisma.ticketingComment.delete({ where: { id } });
  }
}
