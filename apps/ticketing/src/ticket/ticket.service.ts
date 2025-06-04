import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTicketDto & { deadline?: Date }, userId: number) {
    return this.prisma.ticket.create({
      data: {
        ...dto,
        status: dto.status ?? 'OPEN',
        createdById: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      include: { createdBy: true, assignedTo: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { createdBy: true, assignedTo: true },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async update(
    id: string,
    dto: UpdateTicketDto & { deadline?: Date },
    userId: number,
  ) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.createdById !== userId)
      throw new ForbiddenException('Only the owner can update the ticket');

    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: string, userId: number) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.createdById !== userId)
      throw new ForbiddenException('Only the owner can delete the ticket');

    return this.prisma.ticket.delete({ where: { id } });
  }

  async assign(id: string, dto: AssignTicketDto, userId: number) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.assignedToId !== userId)
      throw new ForbiddenException('Only the assigned user can re-assign');

    return this.prisma.ticket.update({
      where: { id },
      data: { assignedToId: dto.assignedToId },
    });
  }
}
