import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { JwtAuthGuard } from '@app/auth/jwt.guard';
import { jalaliDateTimeToGregorian, toJalaliDateTimeString } from '@app/utils';

@ApiTags('Ticket')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Create a new ticket.' })
  async create(@Req() req, @Body() dto: CreateTicketDto) {
    const userId = req.user.userId;

    let deadline: Date | undefined;
    if (dto.deadlineJalali) {
      deadline = new Date(jalaliDateTimeToGregorian(dto.deadlineJalali));
    }

    const ticket = await this.ticketService.create(
      {
        ...dto,
        deadline,
      },
      userId,
    );
    return this.mapTicketToJalali(ticket);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all tickets.' })
  async findAll() {
    const tickets = await this.ticketService.findAll();
    return tickets.map(this.mapTicketToJalali);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get ticket by ID.' })
  async findOne(@Param('id') id: string) {
    const ticket = await this.ticketService.findOne(id);
    return this.mapTicketToJalali(ticket);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Update a ticket.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @Req() req,
  ) {
    const userId = req.user.userId;

    let deadline: Date | undefined;
    if (dto.deadlineJalali) {
      deadline = new Date(jalaliDateTimeToGregorian(dto.deadlineJalali));
    }

    const ticket = await this.ticketService.update(
      id,
      {
        ...dto,
        deadline,
      },
      userId,
    );
    return this.mapTicketToJalali(ticket);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Delete a ticket.' })
  async remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    const ticket = await this.ticketService.remove(id, userId);
    return this.mapTicketToJalali(ticket);
  }

  @Patch(':id/assign')
  @ApiResponse({ status: 200, description: 'Assign ticket.' })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignTicketDto,
    @Req() req,
  ) {
    const userId = req.user.userId;
    const ticket = await this.ticketService.assign(id, dto, userId);
    return this.mapTicketToJalali(ticket);
  }

  private mapTicketToJalali(ticket: any) {
    if (!ticket) return ticket;
    return {
      ...ticket,
      deadline: ticket.deadline
        ? toJalaliDateTimeString(ticket.deadline)
        : null,
      createdAt: ticket.createdAt
        ? toJalaliDateTimeString(ticket.createdAt)
        : null,
      updatedAt: ticket.updatedAt
        ? toJalaliDateTimeString(ticket.updatedAt)
        : null,
      closedAt: ticket.closedAt
        ? toJalaliDateTimeString(ticket.closedAt)
        : null,
    };
  }
}
